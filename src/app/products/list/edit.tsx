'use client'

import { editProduct } from "@actions/product-config";
import { Button, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from "@mantine/notifications";
import { productCreateSchema } from "@schemas/product.schema";
import { ProductType } from "@types";
import { getErrorMessage, getSuccessMessage } from "@utils/notification";
import { useTransition } from 'react';
import { MdDriveFileRenameOutline, MdUpdate as UpdateIcon } from "react-icons/md";
import { TbCoinTakaFilled } from "react-icons/tb";

// Define the props type
type Props = {
  initialData: ProductType
}

/**
 * EditProduct Component
 * Allows users to edit an existing product with name, description, and price fields.
 */
const EditProduct = ({ initialData }: Props) => {
  // Handle transitions for smoother UI updates
  const [isLoading, startTransition] = useTransition()

  // Initialize the form with initial product values
  const { onSubmit, getInputProps, reset } = useForm<Partial<ProductType>>({
    validate: yupResolver(productCreateSchema), // Apply validation schema
    initialValues: {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price
    }
  })

  /**
   * Handles the form submission.
   * Sends an API request to update the product details.
   */
  const submitHandler = (formData: Partial<ProductType>) =>
    startTransition(async () => {
      const res = await editProduct(initialData.id!, formData)
      console.log(res) // Log the response for debugging

      if (res.success) {
        showNotification(getSuccessMessage(res?.message)); // Show success notification
        closeAllModals(); // Close the modal upon success
      } else {
        showNotification(getErrorMessage(res?.message)); // Show error notification
      }
    })

  return (
    <form onSubmit={onSubmit(submitHandler)}>
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
      <Button type="submit" leftSection={<UpdateIcon />} loading={isLoading}>
        Update
      </Button>
    </form>
  )
}

export default EditProduct;
