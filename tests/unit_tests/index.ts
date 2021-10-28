import { assert } from 'chai'
import { handlerGetProduct } from '../../src/controllers/products/get_product_by_name'
import { handlerCreateOrder } from '../../src/controllers/orders/create_order'
import { handlerGetAllOrders } from '../../src/controllers/orders/get_all_orders'
import { handlerGetOrder } from '../../src/controllers/orders/get_order_by_id'
import { ProductDAO, MockProductDAO, Product } from '../../src/db/productdao'
import { OrderDAO, MockOrderDAO, Order } from '../../src/db/orderdao'

describe('Get product by name', () => {
	it('Existing product', async () => {
		const productDAO = new ProductDAO(new MockProductDAO())
		assert.deepEqual(await handlerGetProduct(productDAO, 'Alface'), { status: 200, body: { product_id: 2, name: 'Alface', price: 3.47, quantity: 0 }})
	})
	it('Non Existing product', async () => {
		const productDAO = new ProductDAO(new MockProductDAO())
		assert.deepEqual(await handlerGetProduct(productDAO, 'nao_existe'), { status: 404, body: 'NotFound' })
	})
})

describe('Create order', () => {
	it('Invalid params 1', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, []), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 2', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [1]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 3', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 4', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, ['banana']), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 5', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{name: 'nome'}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 6', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{quantity: 1}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 7', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{name: 1, quantity: 'nome'}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 8', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{name: 'name', quantity: 0}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 9', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{name: 'name', quantity: -1}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 10', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{name: 'name', quantity: -20}]), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 11', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, {name: 'name', quantity: 20}), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 12', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, null), { status: 400, body: 'InvalidParams' })
	})
	it('Invalid params 13', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, undefined), { status: 400, body: 'InvalidParams' })
	})
	it('Product not found 1', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'nao_existe', quantity: 1 }]), { status: 404, body: 'NotFound' })
	})
	it('Product not found 2', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Coffee', quantity: 1 }, { name: 'nao_existe', quantity: 1 }]), { status: 404, body: 'NotFound' })
	})
	it('Product quantity invalid', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Coffee', quantity: 4 }]), { status: 400, body: 'InvalidQuantity' })
	})
	it('Create product success 1', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Coffee', quantity: 1 }]),
			{ status: 200, body: { id: '1', products: [ { name: "Coffee", quantity: 1, price: 2.43 } ], total: 2.43 } }
		)
	})
	it('Create product success 2', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 },
										   { product_id: 2, name: 'Kiwi', price: 921, quantity: 1 }
										 ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Kiwi', quantity: 1 }]),
			{ status: 200, body: { id: '1', products: [ { name: "Kiwi", quantity: 1, price: 9.21 } ], total: 9.21 } }
		)
	})
	it('Create product success 3', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 },
										   { product_id: 2, name: 'Kiwi', price: 921, quantity: 1 }
										 ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Coffee', quantity: 3 }]),
			{ status: 200, body: { id: '1', products: [ { name: "Coffee", quantity: 3, price: 2.43 } ], total: 7.29 } }
		)
	})
	it('Create product success 4', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 },
										   { product_id: 2, name: 'Kiwi', price: 921, quantity: 1 }
										 ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerCreateOrder(orderDAO, [{ name: 'Coffee', quantity: 1 }, { name: 'Kiwi', quantity: 1 }]),
			{ status: 200, body: { id: '1', products: [ { name: "Coffee", quantity: 1, price: 2.43}, { name: 'Kiwi', quantity: 1, price: 9.21 } ], total: 11.64 } }
		)
	})
})

describe('Get all orders', () => {
	it('Zero orders', async () => {
		const mockOrderDB: Order[] = []
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerGetAllOrders(orderDAO), { status: 200, body: { orders: [] } })
	})
	it('One order', async () => {
		const orderInDB = {
			id: "456",
			products: [{name: "Coffee", quantity: 3, price: 2.43 }],
			total: 7.29
		}
		const mockOrderDB: Order[] = [ orderInDB ]
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerGetAllOrders(orderDAO), { status:200, body: { orders: mockOrderDB } })
	})
	it('More than one order', async () => {
		const orderInDB = {
			id: "456",
			products: [{name: "Coffee", quantity: 3, price: 2.43 }],
			total: 7.29
		}
		const orderInDB2 = {
			id: "1",
			products: [{name: "Coffee", quantity: 1, price: 2.43 }],
			total: 2.43
		}
		const mockOrderDB: Order[] = [ orderInDB, orderInDB2 ]
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))

		assert.deepEqual(await handlerGetAllOrders(orderDAO), { status: 200, body: { orders: mockOrderDB } })
	})
})

describe('Get order by id', () => {
	it('Existing order', async () => {
		const orderInDB = {
			id: "456",
			products: [{name: "Coffee", quantity: 3, price: 2.43 }],
			total: 7.29
		}
		const mockOrderDB: Order[] = [ orderInDB ]
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerGetOrder(orderDAO, "456"), { status: 200, body: orderInDB })
	})
	it('Non existing order', async () => {
		const orderInDB = {
			id: "456",
			products: [{name: "Coffee", quantity: 3, price: 2.43 }],
			total: 7.29
		}
		const mockOrderDB: Order[] = [ orderInDB ]
		const mockProductDB: Product[] = [ { product_id: 1, name: 'Coffee', price: 243, quantity: 3 } ]
		const orderDAO = new OrderDAO(new MockOrderDAO(mockProductDB, mockOrderDB))
		assert.deepEqual(await handlerGetOrder(orderDAO, "1"), { status: 404, body: 'NotFound' })
	})
})