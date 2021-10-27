export function isCreateOrderBody(a: any): a is CreateOrderBody {
	if (Array.isArray(a)) {
		return a.every(e => {
			if (typeof e === 'object' 
				&& e.name 
				&& typeof e.name === 'string'
				&& e.quantity 
				&& typeof e.quantity === 'number') {

				return true
			}
			return false
		})
	} else {
		return false
	}
}

type CreateOrderBody = Array<{name: string, quantity: number}>


