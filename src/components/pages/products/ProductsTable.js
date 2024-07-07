// ProductTable.js
import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  Button,
  Switch,
  Stack,
  useToast,
  CircularProgress,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AiFillEye } from 'react-icons/ai';
import { updateProductStatus } from '../../../api/product';

const BASE_URL = 'https://looko-backend.vercel.app/api/v1/product';

const ProductsTable = () => {
  const toast = useToast()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await axios.get(BASE_URL + '/all');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTogglePublish = async (product) => {
    try {
      const res = await updateProductStatus(product._id)
      if (res.status === 200) {
        toast({
          title: "Product status changed successfully",
          position: "top-right",
          status: "success",
          duration: 2000,
          isClosable: true,
        })
        router.reload()
      }
    }
    catch (err) {
      console.log(err)
      toast({
        title: "Error changing product status",
        position: "top-right",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
    }
    finally {
    }
  };

  return (
    <>
      {/* Search Input */}
      <Input
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Stack
        my={5} direction='row'
        align={'center'}
        justify={'flex-end'}>
        <Button
          colorScheme='green'
          onClick={() => {
            router.push('/products/add')
          }}>
          Add Product
        </Button>
      </Stack>
      {/* Product Table */}
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Default Image</Th>
            <Th>Price</Th>
            <Th>Is Published</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={7} textAlign="center">
                <CircularProgress isIndeterminate color="blue.300" />
              </Td>
            </Tr>
          ) : (
            products
              .filter((product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <Tr key={product.id}>
                  <Td>{product.id}</Td>
                  <Td>{product.title}</Td>
                  <Td>
                    <img src={product.defaultImage} alt={product.title} style={{
                      width: '5rem',
                      height: '5rem',
                      objectFit: 'contain'
                    }} />
                  </Td>
                  <Td>{"Rs. " + product.price}</Td>
                  <Td>
                    <Switch
                      size="md"
                      isChecked={product.isPublished}
                      onChange={() => handleTogglePublish(product)}
                    />
                  </Td>
                  <Td>
                    <Stack direction='row'>
                      <IconButton
                        colorScheme='orange'
                        aria-label="Edit"
                        icon={<AiFillEye />}
                        onClick={() => {
                          router.push(`/products/${product?._id}`)
                        }}
                      />
                    </Stack>
                  </Td>
                </Tr>
              ))
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default ProductsTable;
