/*
filters need to look like this:

G R G R G...

groups look like this:

P R P R P R

having relations in arrays as items is pretty annoying and when adding/removing/moving groups,
it will lead to headaches - so how do I solve that?

FilterGroup should be aware of logic before and after it

first part will have before logic null, after logic set by new group addition
last part will just have nothing after it

how will logic update on move/add/remove?

when I add a thing n, the logic of the previous group n-1 should be set -
if it already has logic, current group will copy it before overwriting

G OR G → G AND (G) OR G

when I remove a thing n, if there is a group after, it's logic will be overwritten to n-1

G OR (G) AND G → G OR G

*/

export {}