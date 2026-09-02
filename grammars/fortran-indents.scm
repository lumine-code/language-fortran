; Written by hand rather than ported: upstream's indent model
; (@indent.begin/.end/.branch, matching whole constructs) does not map onto
; this one, which reacts to the tokens on the line being typed.
;
; Fortran opens a block with a statement and closes it with an `end …` of the
; same kind. The opening statement is the whole line, so the construct nodes
; are what drive the indent — but the closing and branching statements have to
; dedent the line they are on, which is what the second list does.

[
  (program)
  (module)
  (submodule)
  (subroutine)
  (function)
  (module_procedure)
  (interface)
  (derived_type_definition)
  (enum)
  (if_statement)
  (do_loop)
  (where_statement)
  (associate_statement)
  (select_case_statement)
  (select_type_statement)
  (block_construct)
] @indent

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

  ; Branches close the previous arm and open the next one, so they dedent
  ; themselves and the `@indent` above puts their body back in.
  (else_clause)
  (elseif_clause)
  (elsewhere_clause)
  (case_statement)
  (type_statement)
] @dedent

[
  "("
  "["
] @indent

[
  ")"
  "]"
] @dedent
