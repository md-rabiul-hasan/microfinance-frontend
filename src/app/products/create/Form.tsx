'use client'

// Import necessary dependencies
import { createProduct } from "@actions/product-config";
import { Button, Container, NumberInput, Paper, Textarea, TextInput, Title } from "@mantine/core";
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { productCreateSchema } from "@schemas/product.schema";
import { ProductType } from '@types';
import { getErrorMessage, getSuccessMessage } from '@utils/notification';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FaSave as SaveIcon } from 'react-icons/fa';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TbCoinTakaFilled } from "react-icons/tb";

/**
 * ProductCreateForm Component
 * Allows users to create a new product with name, description, and price fields.
 */
const ProductCreateForm = () => {
  const router = useRouter(); // Use Next.js router for navigation

  // Manage transition state for form submission
  const [isLoading, startTransition] = useTransition();

  // Initialize form using Mantine's useForm with Yup validation
  const { onSubmit, getInputProps, values, reset } = useForm<ProductType>({
    validate: yupResolver(productCreateSchema), // Apply validation schema
    initialValues: {
      name: '',
      description: '',
      price: 0
    }
  });

  /**
   * Handles the form submission.
   * Calls API to create a new product and manages success/error notifications.
   */
  const submitHandler = (data: ProductType) => {
    startTransition(async () => {
      const res = await createProduct(data); // Call API to create product

      if (res.success) {
        showNotification(getSuccessMessage(res?.message)); // Show success notification
        reset(); // Reset form after successful submission
        router.push('/products/list'); // Navigate to product list page
      } else {
        showNotification(getErrorMessage(res?.message)); // Show error notification
      }
    });
  };

  return (
    <Container size="sm" component="form" onSubmit={onSubmit(submitHandler)}>
      {/* Form Title */}
      <Title order={2} mb="sm">
        Add New Product
      </Title>

      <Paper shadow="xs" p="md">
        {/* Product Name Input */}
        <TextInput
          label="Name"
          mb="xs"
          withAsterisk // Marks the field as required
          leftSection={<MdDriveFileRenameOutline />} // Adds an icon
          {...getInputProps('name')}
        />

        {/* Product Description Input */}
        <Textarea
          label="Description"
          mb="xs"
          withAsterisk
          {...getInputProps('description')}
        />

        {/* Product Price Input */}
        <NumberInput
          label="Price"
          mb="xs"
          withAsterisk
          leftSection={<TbCoinTakaFilled />} // Adds an icon
          {...getInputProps('price')}
        />

        {/* Submit Button */}
        <Button type="submit" leftSection={<SaveIcon />} loading={isLoading}>
          Save
        </Button>
      </Paper>
    </Container>
  );
};

export default ProductCreateForm;
