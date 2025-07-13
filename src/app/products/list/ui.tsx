'use client'

import { ActionIcon, Container, Group, Menu, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { openModal } from '@mantine/modals';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { deleteProduct } from '@actions/product-config';
import TableNav from '@components/common/table-nav';
import TitleBar from '@components/common/title-bar';
import useNavigation from '@hooks/useNavigation';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { ProductType, TPaginatedRes } from '@types';
import { getErrorMessage, getSuccessMessage } from '@utils/notification';
import { IoMdAdd as AddIcon, IoIosMore as MoreIcon } from 'react-icons/io';
import EditProduct from './edit';

// Define the props type
interface Props {
  data: TPaginatedRes<ProductType>;
}

const ProductListUi = ({ data: { data, pagination } }: Props) => {
  const router = useRouter(); // Use Next.js router for navigation
  // Get search parameters and navigation function
  const searchParams = useSearchParams();
  const { navigate } = useNavigation();

  // Manage search input state
  const [interSearch, setInterSearch] = useState(searchParams.get('search') || '');
  const [search] = useDebouncedValue(interSearch, 400); // Debounce search input

  // Retrieve pagination parameters from URL
  const page = Number(searchParams.get('page')) || 1;
  const limit = searchParams.get('per_page') || '10';

  // Handle pagination and search changes
  const handlePageChange = (val: number) => navigate({ page: val.toString() });
  const handleLimitChange = (val: string | null) => navigate({ per_page: val || '10' });

  const addProductHandler = () => (
    router.push('/products/create') // Navigate to product creation page
  );

  const editProductHandler = (product: ProductType) =>
    openModal({
      title: 'Edit Product',
      children: <EditProduct initialData={product} />,
      centered: true
    })

  const deleteHandler = (id: number) => openConfirmModal({
    title: 'Delete product',
    children: <Text size="sm">Do you really want to delete this product?</Text>,
    centered: true,
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    onConfirm: async () => {
      try {
        const res = await deleteProduct(id);
        if (res?.success) {
          showNotification(getSuccessMessage(res?.message)); // Show success notification
        } else {
          showNotification(getErrorMessage(res?.message)); // Show error notification if deletion fails
        }
      } catch (error) {
        showNotification(getErrorMessage("Failed to delete product!")); // Handle exceptions
      }
    }
  });

  // Update the search query in URL whenever `search` changes
  useEffect(() => {
    navigate({ search, page: '1' }); // Reset to page 1 on search
  }, [search]);

  return (
    <Container>
      {/* Page title and search input */}
      <Group justify="space-between" mb="xs">
        <TitleBar title="Product List" url="/" />
        <Group gap="xs">
          <TextInput
            placeholder="Find product here..."
            miw={300}
            value={interSearch}
            onChange={(event) => setInterSearch(event.currentTarget.value)}
          />
          <Tooltip label="Add New Product" withArrow position="bottom">
            <ActionIcon onClick={addProductHandler}>
              <AddIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Product Table */}
      <Paper shadow="xs" mb="xs">
        <Table verticalSpacing={10} horizontalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>SL</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.length > 0 ? (
              data.map((product, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{product.name}</Table.Td>
                  <Table.Td>{product.description}</Table.Td>
                  <Table.Td>{product.price}</Table.Td>
                  <Table.Td>
                    <Menu withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <MoreIcon />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => editProductHandler(product)} >Edit</Menu.Item>
                        <Menu.Item onClick={() => deleteHandler(product.id)}>Delete</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>

                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} align="center">
                  No products found
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pagination Controls */}
      <TableNav
        listName="Products"
        limit={limit}
        limitHandler={handleLimitChange}
        page={pagination?.current_page}
        pageHandler={handlePageChange}
        totalPages={pagination?.last_page}
        totalRecords={pagination?.total}
      />
    </Container>
  );
};

export default ProductListUi;