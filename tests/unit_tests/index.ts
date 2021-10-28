import { assert } from 'chai'
import { handlerGetProduct } from '../../src/controllers/products/get_product_by_name'
import { handlerCreateOrder } from '../../src/controllers/orders/create_order'
import { handlerGetAllOrders } from '../../src/controllers/orders/get_all_orders'
import { handlerGetOrder } from '../../src/controllers/orders/get_order_by_id'
import { ProductDAO, MockProductDAO, Product } from '../../src/db/productdao'
import { OrderDAO, MockOrderDAO, Order, formatOrder, formatAllOrders } from '../../src/db/orderdao'

describe('Get product by name', () => {
	it('Existing product', async () => {
		const mockProductDB: Product[] = [{ product_id: 2, name: 'Alface', price: 347, quantity: 0 }]
		const productDAO = new ProductDAO(new MockProductDAO(mockProductDB))
		assert.deepEqual(await handlerGetProduct(productDAO, 'Alface'), { status: 200, body: { product_id: 2, name: 'Alface', price: 3.47, quantity: 0 }})
	})
	it('Non Existing product', async () => {
		const mockProductDB: Product[] = [{ product_id: 2, name: 'Alface', price: 347, quantity: 0 }]
		const productDAO = new ProductDAO(new MockProductDAO(mockProductDB))
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

describe('Format Order', () => {
	it('Empty list as parameter', () => {
		assert.throws(() => formatOrder([]), 'InvalidParameter')
	})
	it('Join result with single product', () => {
		const join = [ { id: 1, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 } ]
		const res = {
			id: '1',
			products: [
				{
					name: 'teste',
					quantity: 3,
					price: 2.30
				}
			],
			total: 6.9
		}
		assert.deepEqual(formatOrder(join), res)
	})
	it('Join result with more than one product', () => {
		const join = [ 
			{ id: 1, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 },
			{ id: 1, name: 'banana', quantity: 2, price: 1.73, subtotal: 346 }
		]
		const res = {
			id: '1',
			products: [
				{
					name: 'teste',
					quantity: 3,
					price: 2.30
				},
				{
					name: 'banana',
					quantity: 2,
					price: 1.73
				}
			],
			total: 10.36
		}
		assert.deepEqual(formatOrder(join), res)
	})
})

describe('Format All Orders', () => {
	it('Zero orders', () => {
		assert.deepEqual(formatAllOrders([]), [])
	})
	it('One order', () => {
		const join = [ 
			{ id: 1, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 }
		]
		const res =[ {
			id: '1',
			products: [
				{
					name: 'teste',
					quantity: 3,
					price: 2.30
				},
			],
			total: 6.9
		} ]
		assert.deepEqual(formatAllOrders(join), res)
	})
	it('More than one order', () => {
		const join = [ 
			{ id: 1, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 },
			{ id: 2, name: 'banana', quantity: 2, price: 1.73, subtotal: 346 }
		]
		const res =[ 
			{
				id: '1',
				products: [
					{
						name: 'teste',
						quantity: 3,
						price: 2.30
					},
				],
				total: 6.9
			},
			{
				id: '2',
				products: [
					{
						name: 'banana',
						quantity: 2,
						price: 1.73
					},
				],
				total: 3.46
			}
		]
		assert.deepEqual(formatAllOrders(join), res)
	})
	it('Multiple Orders with more than one product each', () => {
		const join = [ 
			{ id: 1, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 },
			{ id: 1, name: 'banana', quantity: 2, price: 1.73, subtotal: 346 },
			{ id: 2, name: 'teste', quantity: 3, price: 2.30, subtotal: 690 },
			{ id: 2, name: 'banana', quantity: 2, price: 1.73, subtotal: 346 },
			{ id: 2, name: 'alface', quantity: 1, price: 3.2, subtotal: 320 },
			{ id: 2, name: 'tomate', quantity: 2, price: 8.9, subtotal: 1780 }
		]
		const res =[ {
			id: '1',
			products: [
				{
					name: 'teste',
					quantity: 3,
					price: 2.30
				},
				{
					name: 'banana',
					quantity: 2,
					price: 1.73
				}
			],
			total: 10.36
			},
			{
				id: '2',
				products: [
					{
						name: 'teste',
						quantity: 3,
						price: 2.30
					},
					{
						name: 'banana',
						quantity: 2,
						price: 1.73
					},
					{
						name: 'alface',
						quantity: 1,
						price: 3.20
					},
					{
						name: 'tomate',
						quantity: 2,
						price: 8.9
					}
				],
				total: 31.36
			}
		]
		assert.deepEqual(formatAllOrders(join), res)
	})
})