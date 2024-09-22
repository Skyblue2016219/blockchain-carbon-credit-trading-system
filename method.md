IV. EFFICIENCY OPTIMIZATION RULES
We analyze the applicability of classical code efficiency
optimization strategies in the context of smart contracts.
Specifically, we consider the efficiency rules postulated in
early work by Bentley [15], which proposes strategies that
are grouped into six categories (time-for-space rules, spacefor-time rules, loop rules, logic rules, procedure rules, and
expression rules).
We decided to analyze these standard rules for two major
reasons. First, the application of these rules is supposed to
be bound to local transformations that are almost independent
from the underlying system specifics (however, we point out
certain rules in which optimizations are highly context-specific
for smart contracts). Second, given the simplistic nature of the
cost model described above, analyzing the efficacy of rules
geared towards general-purpose procedural languages, we can
establish a baseline for more domain-specific optimizations.
Our first goal is to put these efficiency optimization rules
into context for Solidity source code and Ethereum smart
contracts. To that end, we provide a general description of
each rule and how it could be applied to reduce gas cost, or
whether applying the rule has no effect on gas cost or may
even lead to cost increase. The second goal of our study is
to mark rules with labels with respect to their efficacy for
classifying and automatically fixing efficiency issues.
We present an analysis of 25 rules, organized in the
six categories, to provide contextualization with respect to
Solidity/Ethereum smart contracts and visibly label each rule
with one of the following labels:
• [Non-intrusive Fix]: The rule can be automatically
classified and a non-intrusive, context-independent fix
exists. Non-intrusive fixes are changes that semantically
preserve functionality without introducing increased code
complexity or maintenance cost [21]. We implement these
non-intrusive fixes as part of this work.
• [Automated Rule Classification]: The rule can be constructed as a context-independent automated classifier.
We implement the classifier as part of this work and
quantify the presence of these rules. However, we do not
provide a non-intrusive (automated) fix.
• [Context-dependent Rule]: This label marks rules for
which we cannot construct an automated, contextindependent classifier, but which can theoretically lead
to gas savings. We opt for a conservative definition here
where we regard a rule as context-dependent if there
is possibility for uncertainty in the classifier (due to
context-specific properties). We acknowledge that more
context- or domain-specific classifiers could potentially
be constructed, but are beyond the scope of this work.
• [No Gas Savings]: The rule is not applicable to achieve
gas savings.
• [Included in Compiler]: The rule is already implemented
in the Solidity compiler solc3
and will therefore not lead
to further gas savings.
We perform initial analysis with simple code fragments
addressing the rules to assess if cost benefits can be achieved
during smart contract deployment and invocations. This additionally checks whether a particular rule is already imple3Version v0.15.3, which was the latest when conducting the work at hand.
mented in solc. We leverage the possibility to activate and
deactivate compiler-internal optimization in solc, and run
the original and optimized source code with activated and
deactivated optimization.
A. Time-for-Space Rules
The basic idea of time-for-space rules is that space in terms
of memory or storage is reduced, while the execution time
is increased, since data is not directly available, and needs
to be recalculated. In general, smart contracts deployed in
the EVM can be assessed to be not very time-critical, since
there is an inherent delay when invoking a smart contract [22].
This means that time-critical applications should rather not be
deployed in the EVM in the first place. Therefore, adding some
execution time should not be an issue in most applications.
a) [Context-dependent Rule] Time-for-Space Rule 1:
Packing: Packing adopts dense storage representations. One
approach to implement this is to apply overlaying, i.e., to use
the same storage space to store data that is never needed at
the same time. For instance, the same variable could be used
for different things, if a variable is defined in a function and
then never reused. In the EVM, defining less variables directly
leads to decreased gas cost, since the operation for setting a
storage value from zero to non-zero (SSET) costs 20,000 gas
units, while the EVM operation for resetting a storage value
to another non-zero value (SRESET) costs 5,000 gas units.
Hence, packing could be suitable to enable more costefficient smart contract code. However, it is not trivial to
implement this rule defensively: The identification of packing
possibilities generates a false positive whenever the usage of
a variable is not found.
b) [Context-dependent Rule] Time-for-Space Rule 2: Interpreters: This rule aims at reducing the space required by
using interpreters for compact representations. The simplest
application of an interpreter are subroutines, i.e., part of a
function is defined as a subroutine and can then be called.
Integrating subroutines may lead to decreased deployment
cost, because the size of a smart contract is potentially
decreased if subroutines are inserted into the code. However,
the invocation cost may increase, since calling a subroutine is
usually (a little bit) more expensive than calling code directly
(see also Procedure Rule 1: Collapsing Procedure Hierarchies).
Identifying subroutines is closely related to “extract
method” refactoring [23], and a complex task which provides
a certain degree of uncertainty if a routine has really been
identified or not. Hence, we decided not to further pursue this
rule in the scope of this work.
B. Space-for-Time Rules
Space-for-time rules are based on the idea to store redundant
information to decrease the runtime of a system. We regard
space-for-time rules to not be generally applicable for reducing
gas cost since storage is expensive in blockchains. This is
the case for data structure augmentation and the storage of
precomputed results. Nevertheless, there are two space-fortime rules which could be applicable to smart contracts when
aiming at gas cost optimization:
a) [Included in Compiler] Space-for-Time Rule 1:
Caching: The caching of the most frequently accessed data in
the volatile memory (instead of the persistent storage) could
lead to gas savings, since accessing the memory (MLOAD) is
way cheaper than accessing the storage (SLOAD). Our analysis
has shown that this optimization strategy has already been
implemented in solc.
b) [Context-dependent Rule] Space-for-Time Rule 2:
Lazy Evaluation: This rule aims at avoiding unnecessary
evaluations, e.g., calculations or expression checks [24]. As a
simplified example for memorization (which is a prerequisite
for lazy evaluation), let us use the calculation of Fibonacci
numbers. These numbers could either be calculated beforehand, which would be the above mentioned storage of precomputed results, or numbers are calculated when needed and
stored at that point of time (e.g., in a lookup table), thus
avoiding recalculations. We conducted an initial analysis to
assess if this rule could lead to gas cost reduction. In this
analysis, an additional mapping was introduced into a standard
function, and filled and reused during function calls. This led
to higher deployment cost, but lower invocation cost for the
implemented smart contract.
In general, this rule could be applied if the number of
invocations is high enough to justify the overhead of storing
precomputed values in a lookup table, following the lazy
evaluation principle. To apply this rule, expertise on the specific application is required, which means that the automatic
classification and fixing according to this rule is difficult to
achieve without introducing domain-specific heuristics.
C. Loop Rules
The loop rules discussed in the following paragraphs apply
general best practices when programming loops. As will be
shown in the following, all discussed loop rules are generally
applicable to Solidity smart contracts.
a) [Non-intrusive Fix] Loop Rule 1: Code Motion out
of Loops: This rule describes that repeated calculations that
are inside a loop and do not depend on a loop variable can be
moved outward of the loop. Thus, a calculation is performed
only once instead of in each loop iteration. This may lead
to additional deployment cost, if a new variable needs to
be defined. However, the invocation cost for the optimized
function is expected to be much cheaper. The only exception is
if a loop has only one iteration. Therefore, calculations that do
not depend on the loop variable should be moved outside the
loop. This can always be applied to Solidity smart contracts.
b) [Automated Rule Classification] Loop Rule 2: Combining Tests: The goal of this rule is to decrease the number
of tests for a loop. In the best case, only one test condition
needs to be applied. As in Loop Rule 1, this may lead to higher
deployment cost, while the invocation cost of a function are
decreased. This rule is generally applicable with regard to the
identification of potential combinations. However, automated
optimization is context-dependent.
c) [Non-intrusive Fix] Loop Rule 3: Loop Unrolling: In
some cases, it might be meaningful to remove small loops
to save the cost of modifying the loop variables and of
checking the loop condition. Usually, this leads to higher
deployment cost, while the invocation cost are reduced. This
makes Loop Rule 3 generally eligible for optimizing Solidity
smart contracts. It should be noted that automatic identification
and subsequent optimization is not trivial if loops are nested
or conditions are not automatically optimized. Therefore, in
our implementation, we will differentiate between simple and
complex loops (see Section V).
d) [Non-intrusive Fix] Loop Rule 4: Transfer-driven
Loop Unrolling: This rule extends Loop Rule 3 by only
externalizing trivial assignments made within a loop, i.e., the
loop is still in the source code, but trivial assignments are
moved outside the loop. For instance, this can be achieved by
eliminating superfluous variables inside a loop. This should
lead to savings in gas cost for both smart contract deployment
and invocation, since storage and memory space are decreased.
e) [Non-intrusive Fix] Loop Rule 5: Unconditional
Branch Removing: The basic idea of this rule is to remove
unconditional branches at the end of a loop. Instead, the loop
should be rotated in order to have a conditional branch at
the end. For instance, this can be achieved by replacing a
for-loop or while-loop with a do-while-loop. This removes a
conditional jump at the beginning and an unconditional jump
at the end of the loop. Instead, there is only a conditional jump
at the end, thus saving gas cost.
f) [Automated Rule Classification] Loop Rule 6: Loop
Fusion: Loop fusion combines multiple loops that apply to the
same set of elements. This may lead to decreased deployment
cost, since the smart contract code becomes shorter. Also, the
invocation of a smart contract may become cheaper, since only
one loop (instead of several loops) needs to be iterated. As
with the other five loop rules, we therefore further regard this
rule in our implementation (see Section V).
D. Logic Rules
This category of rules deals with logic evaluations that test
the program state. The rules describe how code logic can be
modified without semantic changes to increase cost efficiency.
a) [Non-intrusive Fix] Logic Rule 1: Exploit Algebraic
Identities: The idea of this rule is to replace expensive expressions with semantically equivalent, yet cheaper, expressions.
One example is the application of De Morgan’s law, i.e.,
¬a ∨ ¬b ≡ ¬(a ∧ b). By replacing the first term ¬a ∨ ¬b with
the second term ¬(a ∧ b), it is possible to get rid of a NOT
operation in Solidity. Of course, there are further examples for
exploiting algebraic identities.
The rule is generally applicable, however, it is not always
trivial to identify these parts of optimization automatically,
because they heavily depend on the use case. Still, easily
applicable examples like De Morgan’s law exist.
b) [Context-dependent Rule] Logic Rule 2: Shortcircuiting Monotone Functions: This rule can be applied when
a monotone function is tested for a threshold. The idea is
to introduce a break into a function as soon as the result is
known, avoiding excessive calculations. A typical example of
the short-circuit evaluation is that instead of evaluating both
expressions A and B, we only evaluate the first expression.
So, if A is already false, B is not evaluated, because the
overall expression cannot become true any longer. However,
this cannot be applied if B has some important side effects.
Utilizing this rule may lead to cost reductions during smart
contract invocations, since a contract can potentially avoid
to be executed in its entirety. However, for more complex
expressions that may introduce side-effects, it is difficult to
construct an automated (general-purpose) classifier that avoids
false positives.
c) [Context-dependent Rule] Logic Rule 3: Reordering
Tests: Tests, i.e., conditions, can be arranged in different
orders. This rule exploits this by rearranging tests so that
“cheap” tests, i.e., tests most likely evaluated to true, are
placed before expensive tests, which are more likely to be
evaluated to false. For instance, this can be done in an
if-then-else clause. Again, the problem is the necessity of
estimating which condition is most likely evaluated to true,
which requires domain expertise.
d) [No Gas Savings] Logic Rule 4: Precompute Logical
Functions: The aim of this rule is to replace the calculation
of a logical function by a lookup table. As discussed in
Section IV-B, the issue is, however, that storage is expensive
in the EVM, and it is therefore generally not meaningful (if
the goal is to save gas) to use additional space in order to save
time. Precomputation may save some gas in future invocations,
but the additional deployment cost are usually too high and
access to the precomputed results is still very expensive.
e) [Non-intrusive Fix] Logic Rule 5: Boolean Variable
Elimination: The basic idea of this rule is to get rid of Boolean
variables and to replace them with an if-then-else condition.
For instance, we can replace a Boolean variable, which stores
the result of a logical expression, with the actual logical
expression, whenever the Boolean variable is originally used
in a condition. This saves deployment cost, since the variable
is not needed any longer, and may also lead to less cost during
smart contract invocation.
E. Procedure Rules
This category of optimization strategies deals with the
underlying structure of a program organized in procedures.
a) [No Gas Savings] Procedure Rule 1: Collapsing
Procedure Hierarchies: Collapsing procedure hierarchies describes that procedure calls are replaced by inserting code
directly into a smart contract (with appropriate binding of
variables). Notably, this rule is the counterpart to Time-forSpace Rule 2: Interpreters that has already been discussed
in Section IV-A. Following the idea of collapsing procedure
hierarchies, the deployment of a smart contract is more expensive, since additional source code is needed. However, the
invocation cost may decrease.
We conducted some pre-analysis for this rule by replacing
iterative procedure calls by inlining code that shows the
additional deployment cost being too high to yield any savings.
b) [Context-dependent Rule] Procedure Rule 2: Exploit
Common Cases: This rule follows the goal to treat frequent
cases efficiently. Thus, it is related to Space-for-Time Rule 1:
Caching (see Section IV-B), which we found to be applicable
to Solidity smart contracts. Identifying the occurrence of this
rule and its application is a complex task, since it is necessary
to have the domain expertise to identify the most frequent
cases, and to implement accordingly efficient code for this
special case. Naturally, the application of this rule is only
meaningful if it is possible to apply a more efficient (while
correct) code fragment. Thus, while it would make sense to
apply this rule whenever a special piece of code for the most
common cases leads to less gas cost, classification and fixing
are very context-dependent.
c) [No Gas Savings] Procedure Rule 3: Coroutines:
This rule optimizes code by adding coroutines [25]. Since the
EVM does not support coroutines, this rule is not applicable.
d) [Automated Rule Classification] Procedure Rule 4:
Transformations on Recursive Procedures: The transformation
of recursive procedures into iterative procedures may lead to
gas cost savings. In many cases, this will lead to increased
deployment cost, e.g., since additional variables need to be
defined. However, there might be less cost during smart
contract invocation.
e) [No Gas Savings] Procedure Rule 5: Parallelism:
Parallelism describes that tasks are carried out in parallel, e.g.,
using threads. Since there is no support for concurrency in the
EVM [26], [27], this rule cannot be applied here.
F. Expression Rules
Expression rules describe the optimization of expressions,
such as reusing results or replacing expensive expressions
with cheaper ones. As will be discussed in the following
paragraphs, this includes the adaptation of some of the already
discussed rules to expressions.
a) [Included in Compiler] Expression Rule 1: Compiletime Initialization: This rule adapts principles of the previously discussed Loop Rule 1: Code Motion out of Loops,
which we assessed to be applicable to Solidity smart contracts.
Expression Rule 1 could for instance be applied by replacing
an expression directly with its result, if possible. Our analysis
has shown that this rule is already implemented in solc.
b) [Context-dependent Rule] Expression Rule 2: Exploit
Algebraic Identities: The basic functionality of this rule has
already been discussed in Logic Rule 1: Exploit Algebraic
Identities. As discussed in Section IV-D, this rule is in general
applicable to Solidity smart contracts, but it is not always
trivial to identify these optimization parts in an automated
fashion. Hence, it is necessary to analyze in more detail
the algebraic identities which could be applied in Solidity.
Unfortunately, this goes beyond the scope of the work at hand.
c) [Context-dependent Rule] Expression Rule 3: Common Sub-expression Elimination: This rule is related to Spacefor-Time Rule 2: Lazy Evaluation. Its basic idea is to avoid
the repeated calculation of the same expression by saving the
result of the first invocation and then reusing this result later
on. Hence, it makes sense to apply this rule if the number of
accesses is large enough to justify the overhead of storing the
precomputed values in a lookup table. As with lazy evaluation,
the applicability of this rule needs to be answered separately
for each use case. Therefore, the rule is not further regarded
within the work at hand.
d) [Context-dependent Rule] Expression Rule 4: Pairing
Computation: The goal of this rule is to combine expressions
into pairs that are similar and can be evaluated together. These
expressions are then implemented in a procedure. Pairing computation is related to Loop Rule 6: Loop Fusion, where several
loops are combined, as well as Procedure Rule 2: Exploit
Common Cases, where a new code fragment is introduced
for common cases. For instance, instead of separately finding
the minimum and maximum from a dataset, this could be
combined into one expression. While in general useful for the
cost optimization of Solidity smart contracts, the application of
this rule is hampered by the difficulty to automatically identify
application cases.
e) [Context-dependent Rule] Expression Rule 5: Exploit
Word Parallelism: Following this rule allows to execute different operations on words in parallel, e.g., different Boolean
operations. For this, it is necessary to put related bits next to
each other in a word. However, the identification of related
bits is context-dependent.


优化说明:
使用calldata替代memory：在redeem函数中,将message参数改为calldata存储,可以节省gas。
结构体优化：在getRedemptionById函数中,使用storage而不是memory来访问结构体,减少不必要的复制。
函数返回值优化：在getRedemptionById函数中,直接在返回语句中命名返回值,可以略微节省gas。
4. 移除不必要的临时变量：在_createRedemption函数中,直接创建结构体而不使用临时变量。
循环优化：虽然本合约中没有明显的循环,但如果将来添加循环,应考虑应用循环规则,如代码外移和循环展开。
布尔变量消除：本合约中没有明显的布尔变量可以消除,但这是一个值得记住的优化技巧。
编译时初始化：确保所有可以在编译时确定的常量都被正确初始化。
这些优化虽然看起来微小,但在大规模使用时可以累积成显著的gas节省。同时,我们保持了代码的可读性和功能不变。如果有更复杂的逻辑或循环在未来被添加到合约中,可以考虑应用更多的优化规则。