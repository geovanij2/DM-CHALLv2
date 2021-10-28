export const PG_CHECK_VIOLATION_ERROR_CODE = '23514'

export function isConstraintError(e: any): boolean {
	return e.code === PG_CHECK_VIOLATION_ERROR_CODE
}