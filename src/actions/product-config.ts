'use server'

import { ProductType } from '@types';
import api from '@utils/api';
import { revalidatePath } from "next/cache";

export const createProduct = async (formData: ProductType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/products', {
      ...formData
    })

    if (path) revalidatePath(path)

    return data
  } catch (error) {
    return error.response?.data
  }
}


export const getProductList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/products', {
      params,
    });

    return data;
  } catch (error) {
    return error.response?.data
  }
};


export const editProduct = async (id: number, formData: Partial<ProductType>) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/products/${id}`, formData);
    revalidatePath("/products/list");
    return data;
  } catch (error) {
    return error.response?.data;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/products/${id}`);
    revalidatePath("/products/list");
    return data;
  } catch (error) {
    return error.response?.data;
  }
}