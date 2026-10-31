; An unexpected quote identifies an unfinished literal, not an array opener.
; Continuation markers anchor rows whose literal payload has no syntax node.
(ERROR (ERROR) @_quote [(_) "&" "(" ")" "[" "]"] @preserve
  (#match? @_quote "^[\"']$")
  (#is? indent.reindent true)
  (#set! indent.allowEmpty true)
  (#set! indent.force true))

(ERROR (ERROR) @_quote ["(" ")" "[" "]"] @match.next
  (#match? @_quote "^[\"']$")
  (#set! indent.match startPosition)
  (#set! capture.final true))

((ERROR) @match.next
  (#match? @match.next "^[\"']$")
  (#set! indent.match startPosition))

; Preserve the exact contents of multiline literals during explicit reindent.
([(string_literal) (comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

; Written by hand rather than ported: upstream's indent model
; (@indent.begin/.end/.branch, matching whole constructs) does not map onto
; this one, which reacts to the tokens on the line being typed.
;
; Capture opening tokens, not whole constructs: a program or clause node
; overlaps every body row and would keep adding indentation after each Enter.
(program_statement "program" @indent)
(module_statement "module" @indent)
(submodule_statement "submodule" @indent)
(subroutine_statement "subroutine" @indent)
(function_statement "function" @indent)
(module_procedure_statement "procedure" @indent)
(interface_statement "interface" @indent)
(derived_type_statement "type" @indent)
(enum_statement "enum" @indent)
(do_statement "do" @indent)
(associate_statement "associate" @indent)
(select_case_statement ["select" "selectcase"] @indent)
(select_type_statement ["select" "selecttype"] @indent)
(block_construct "block" @indent)

; Inline IF/WHERE statements do not open a body. THEN identifies a block IF;
; an END WHERE child distinguishes block WHERE from its assignment form.
(if_statement "then" @indent)
(where_statement "where" @indent (end_where_statement))

; Branch headers dedent themselves and indent their following body. Capture
; only their keywords so neither effect leaks into later rows in the clause.
(elseif_clause ["else" "elseif"] @dedent)
(elseif_clause "then" @indent)
(else_clause "else" @dedent @indent)
(elsewhere_clause ["else" "elsewhere"] @dedent @indent)
(case_statement "case" @dedent @indent)
(type_statement ["type" "class"] @dedent @indent)

[
  (end_program_statement)
  (end_module_statement)
  (end_submodule_statement)
  (end_subroutine_statement)
  (end_function_statement)
  (end_module_procedure_statement)
  (end_interface_statement)
  (end_type_statement)
  (end_enum_statement)
  (end_if_statement)
  (end_do_loop_statement)
  (end_where_statement)
  (end_associate_statement)
  (end_select_statement)
  (end_block_construct_statement)

] @dedent

[
  "("
  "["
] @indent

[
  ")"
  "]"
] @dedent
