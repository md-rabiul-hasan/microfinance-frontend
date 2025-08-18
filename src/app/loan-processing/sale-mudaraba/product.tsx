'use client'

import { useEffect, useState } from 'react'
import { Table, Text, ScrollArea, LoadingOverlay, ActionIcon, Title } from '@mantine/core'
import { getSellableProductList } from '@actions/loan-processing/sale-murabaha-config'

interface Product {
  product_uniq_id: string
  item_details: string
  purchase_cost: number
  purchase_date: string
  purchase_from: string
}

interface ProductListModalProps {
  onSelect: (product: Product) => void
  onClose: () => void
}

const ProductListModal = ({ onSelect, onClose }: ProductListModalProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellableProducts = async () => {
      try {
        setLoading(true)
        const response = await getSellableProductList()
        setProducts(response.data)
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSellableProducts()
  }, [])

  const handleSelect = (product: Product) => {
    onSelect(product)
    onClose()
  }

  const rows = products.map((product, index) => (
    <Table.Tr key={product.product_uniq_id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{product.product_uniq_id}</Table.Td>
      <Table.Td>{product.item_details}</Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>{new Intl.NumberFormat().format(product.purchase_cost)}</Table.Td>
      <Table.Td>{product.purchase_date}</Table.Td>
      <Table.Td>
        <ActionIcon variant="subtle" color="blue" onClick={() => handleSelect(product)} title="Select this product">
          <Text size="xs">Sell</Text>
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <ScrollArea>
      <Title order={4} mb="md">
        Sellable Product List
      </Title>
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>SL</Table.Th>
            <Table.Th>Product Code</Table.Th>
            <Table.Th>Product Details</Table.Th>
            <Table.Th>Purchase Cost</Table.Th>
            <Table.Th>Purchase Date</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}

export default ProductListModal
