; Ported from upstream by script/port-nvim-queries.js.
; Scopes end in ".fortran".

[
 (identifier)
 (module_name)
] @variable.other.fortran

(string_literal) @string.quoted.fortran
(number_literal) @constant.numeric.fortran
(statement_label) @constant.numeric.fortran
(statement_label_reference) @constant.numeric.fortran
(boolean_literal) @constant.language.boolean.fortran
(comment) @comment.line.exclamation.fortran
(custom_directive) @keyword.control.directive.fortran

[
 (derived_type)
 (derived_type_statement)
 (import_statement)
 (intrinsic_type)
 (type_name)
] @support.type.fortran

(intrinsic_type) @support.type.builtin.fortran

(base_type_specifier
  (identifier) @support.type.fortran)

[
 (module_statement)
 (submodule_statement)
] @entity.name.namespace.fortran

[
 (abstract_specifier)
 (access_specifier)
 (block_label)
 (block_label_start_expression)
 (none)
 (procedure_attributes)
 (procedure_qualifier)
 (type_qualifier)
] @entity.other.attribute-name.fortran

[
 "#define"
 "#elif"
 "#endif"
 "#if"
 "#ifdef"
 (base_type_specifier)
 (block_construct)
 (contains_statement)
 (default)
 (end_associate_statement)
 (end_block_construct_statement)
 (end_block_data_statement)
 (end_coarray_critical_statement)
 (end_coarray_team_statement)
 (end_do_loop_statement)
 (end_enum_statement)
 (end_enumeration_type_statement)
 (end_forall_statement)
 (end_function_statement)
 (end_if_statement)
 (end_interface_statement)
 (end_module_procedure_statement)
 (end_module_statement)
 (end_program_statement)
 (end_select_statement)
 (end_submodule_statement)
 (end_subroutine_statement)
 (end_type_statement)
 (end_where_statement)
 (enum_statement)
 (enumeration_type_statement)
 (enumerator_statement)
 (equivalence_statement)
 (function_statement)
 (implicit_statement)
 (interface_statement)
 (keyword_statement)
 (language_binding)
 (namelist_statement)
 (print_statement)
 (procedure_statement)
 (program_statement)
 (subroutine_statement)
] @keyword.control.fortran

(use_statement "use" @keyword.control.fortran)
(use_statement "intrinsic" @keyword.control.fortran)
(included_items "only" @keyword.control.fortran)
(allocate_statement "allocate" @keyword.control.fortran)
(deallocate_statement "deallocate" @keyword.control.fortran)
(subroutine_call "call" @keyword.control.fortran)
(do_statement "do" @keyword.control.fortran)
(while_statement "while" @keyword.control.fortran)
(if_statement ["if" "then"] @keyword.control.fortran)
(elseif_clause ["else" "if" "elseif"] @keyword.control.fortran)
(else_clause "else" @keyword.control.fortran)
(open_statement "open" @keyword.control.fortran)
(write_statement "write" @keyword.control.fortran)
(private_statement "private" @keyword.control.fortran)
(public_statement "public" @keyword.control.fortran)

(select_case_statement "select" @keyword.control.fortran "case" @keyword.control.fortran)
(select_type_statement "select" @keyword.control.fortran "type" @keyword.control.fortran)
(select_rank_statement "select" @keyword.control.fortran "rank" @keyword.control.fortran)
(case_statement "case" @keyword.control.fortran)
(type_statement "type" @keyword.control.fortran)
(rank_statement "rank" @keyword.control.fortran)

[
 "*"
 "+"
 "-"
 "/"
 "="
 "<"
 ">"
 "<="
 ">="
 "=="
 "/="
 ".and."
 ".or."
 ".lt."
 ".gt."
 ".ge."
 ".le."
 ".eq."
 ".eqv."
 ".neqv."
 ".ne."
] @keyword.operator.fortran

;; Brackets
"(" @punctuation.definition.begin.bracket.round.fortran
")" @punctuation.definition.end.bracket.round.fortran

"[" @punctuation.definition.array.begin.bracket.square.fortran
"]" @punctuation.definition.array.end.bracket.square.fortran

;; CUDA kernel launch bounds.
"<<<" @punctuation.definition.kernel.begin.fortran
">>>" @punctuation.definition.kernel.end.fortran

;; Delimiter
"::" @punctuation.separator.declaration.fortran
"," @punctuation.separator.comma.fortran
":" @punctuation.separator.colon.fortran

;; Component access, as in `point%x`.
"%" @keyword.operator.accessor.fortran

"&" @punctuation.separator.continuation.fortran

(parameters
  (identifier) @variable.parameter.fortran)

(program_statement
  (name) @variable.other.fortran)

(module_statement
  (name) @variable.other.fortran)

(submodule_statement
  (module_name) (name) @variable.other.fortran)

(function_statement
  (name) @entity.name.function.fortran)

(subroutine_statement
  (name) @entity.name.function.fortran)

(module_procedure_statement
  (name) @entity.name.function.fortran)

(end_program_statement
  (name) @variable.other.fortran)

(end_module_statement
  (name) @variable.other.fortran)

(end_submodule_statement
  (name) @variable.other.fortran)

(end_function_statement
  (name) @entity.name.function.fortran)

(end_subroutine_statement
  (name) @entity.name.function.fortran)

(end_module_procedure_statement
  (name) @entity.name.function.fortran)

(subroutine_call
  (identifier) @entity.name.function.fortran)

(keyword_argument
  name: (identifier) @keyword.control.fortran)

(derived_type_member_expression
  (type_member) @variable.other.member.fortran)
