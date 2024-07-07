import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody, Tr, Th,
  Td, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  CircularProgress,
  IconButton,
  Flex,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import { AiOutlineSearch, AiOutlineClear, AiOutlineEdit, AiFillEye } from 'react-icons/ai';
import axios from 'axios'
import { MdOutlineContentCopy } from "react-icons/md"
import Fuse from 'fuse.js'
import { useRouter } from 'next/router';
const API_BASE_URL = 'https://looko-backend.vercel.app/api/v1/order'

const OrdersTable = () => {
  const ORDER_STATUS = [{
    heading: 'Payment Failed',
    label: 'Pending',
    bgColor: '#ff9966',
  }, {
    heading: 'Shipped',
    label: 'Shipped',
    bgColor: '#ffcc00',
  }, {
    heading: 'Delivered',
    label: 'Delivered',
    bgColor: '#99cc33',
  }, {
    heading: 'Cancelled',
    label: 'Cancelled',
    bgColor: '#cc3300',
  },
  {
    heading: 'Order Placed',
    label: 'Order Placed',
    bgColor: '#cc3300',
  },
  ]
  const toast = useToast()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenShowOrder, onOpen: onOpenShowOrder, onClose: onCloseShowOrder } = useDisclosure()
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([])
  const [newOrder, setNewOrder] = useState({
    fullName: '',
    email: '',
    phone: '',
    completeAddress: '',
    pincode: '',
    paymentMethod: '',
    items: []
  })
  const [fuse, setFuse] = useState(null)
  const [editOrder, setEditOrder] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleCopy = (info) => {
    navigator.clipboard.writeText(info)
    toast({
      position: 'top-right',
      title: 'Orders Details Copied',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/all`);
      setOrders(res.data.data);

      const options = {
        keys: ['id'],
        includeScore: true,
      };
      setFuse(new Fuse(res.data.data, options));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error Fetching Orders',
        description: 'An error occurred while fetching all orders.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    if (fuse) {
      const searchResults = fuse.search(searchTerm);
      setOrders(searchResults.map((result) => result.item));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchOrders();
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('subheading', newPost.subheading);
      formData.append('description', newPost.description);
      formData.append('isPublished', newPost.isPublished);

      await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onClose();
      fetchOrders();
      toast({
        title: 'Order Created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error Creating Order',
        description: 'An error occurred while creating the order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setIsEditing(true);
    onOpen();
  }

  const handleChangeOrderStatus = async (e, id) => {
    e.preventDefault();
    try {
      console.log(id, e.target.value)
      const res = await axios.patch(`${API_BASE_URL}/${id}/status`, {
        status: e.target.value?.toLowerCase()
      })
      if (res.status === 200) {
        toast({
          title: 'Order Status Updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        router.push('/orders')
      }
    }
    catch (err) {
      console.log(err)
      toast({
        title: 'Error Updating Order Status',
        description: 'An error occurred while updating the order status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleShowOrder = (order) => {
    setSelectedOrder(order);
    onOpenShowOrder()
  }

  const handleUpdatePost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullName', editOrder.fullName);
      formData.append('subheading', editOrder.subheading);
      formData.append('description', editOrder.description);
      formData.append('isPublished', editOrder.isPublished);

      await axios.put(`${API_BASE_URL}/${editOrder.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onClose();
      fetchOrders();
      setIsEditing(false);
      toast({
        title: 'Order Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error Updating Order',
        description: 'An error occurred while updating the order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box p={4}>
      <Flex mb={4} justify="space-between" align="center">
        <FormControl>
          <Input
            type="text"
            placeholder="Search by order id"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        <Flex>
          <IconButton
            icon={<AiOutlineSearch />}
            colorScheme="blue"
            onClick={handleSearch}
            aria-label="Search"
            mr={2}
          />
          <IconButton
            icon={<AiOutlineClear />}
            colorScheme="red"
            onClick={handleClearSearch}
            aria-label="Clear"
          />
        </Flex>
      </Flex>
      {/* <Button onClick={() => { setEditOrder(null); setIsEditing(false); onOpen(); }}
        leftIcon={<BiSolidPackage />}>
        Add Order
      </Button> */}
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th w='200px'>ID</Th>
            <Th w='200px'>Date of Order Placement</Th>
            <Th w='200px'>Fullname</Th>
            <Th w='400px'>Email</Th>
            <Th w='400px'>Phone</Th>
            <Th w='400px'>Address</Th>
            <Th w='400px'>Pincode</Th>
            <Th w='600px'>Status</Th>
            <Th w='200px'>Payment Method</Th>
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
            orders.length > 0 &&
            orders?.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>
                  {dayjs(order.createdAt).format('DD/MM/YYYY')}
                </Td>
                <Td>
                  {order.fullName}
                </Td>
                <Td>
                  <Stack direction='row' align='center' justify='space-between'>
                    <Text>
                      {order.email}
                    </Text>
                    <Box>
                      <MdOutlineContentCopy style={{
                        cursor: 'pointer'
                      }} onClick={() => handleCopy(order.email)} />
                    </Box>
                  </Stack>
                </Td>
                <Td>
                  <Stack direction='row' align='center' justify='space-between'>
                    <Text>
                      {order.phone}
                    </Text>
                    <Box>
                      <MdOutlineContentCopy style={{
                        cursor: 'pointer'
                      }} onClick={() => handleCopy(order.phone)} />
                    </Box>
                  </Stack>
                </Td>
                <Td>
                  <Stack w='220px' direction='row' align='center' justify='space-between'>
                    <Text fontSize='xs'>
                      {order.completeAddress}
                    </Text>
                    <Box>
                      <MdOutlineContentCopy
                        style={{
                          cursor: 'pointer'
                        }} onClick={() => handleCopy(order.completeAddress)} />
                    </Box>
                  </Stack>
                </Td>
                <Td>
                  <Stack direction='row' align='center' justify='space-between'>
                    <Text>
                      {order.pincode}
                    </Text>
                    <Box>
                      <MdOutlineContentCopy style={{
                        cursor: 'pointer'
                      }} onClick={() => handleCopy(order.pincode)} />
                    </Box>
                  </Stack>
                </Td>
                <Td>
                  <Select w='160px'
                    onChange={(e) => handleChangeOrderStatus(e, order._id)}>
                    {ORDER_STATUS.map((status) => (
                      <option
                        style={{
                          color: status.bgColor,
                        }}
                        key={status.label} defaultValue={status.label.toLowerCase()}
                        selected={status.label?.toLocaleLowerCase() === order.status}>
                        {status.heading}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  {order?.status === 'payment failed' ? '-' : "Stripe"}
                </Td>
                <Td>
                  <Stack direction='row' align='center'>
                    <IconButton
                      icon={<AiOutlineEdit />}
                      colorScheme="blue"
                      onClick={() => handleEditOrder(order)}
                      aria-label="Edit Order"
                    />
                    <IconButton
                      icon={<AiFillEye />}
                      colorScheme="blue"
                      onClick={() => handleShowOrder(order)}
                      aria-label="View Order"
                    />
                  </Stack>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {isEditing ? (
            <>
              <ModalHeader>Edit Order Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleUpdatePost}>
                  Update
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>Add a New Order</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* Add form */}
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={newOrder.fullName}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, fullName: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <Input
                    value={newOrder.email}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, email: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Complete Address</FormLabel>
                  <Input
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    value={newOrder.pincode}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, pincode: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Payment Method</FormLabel>
                  <Input
                    value={newOrder.paymentMethod}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, paymentMethod: e.target.value })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleCreateOrder}>
                  Create
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal size='2xl' isOpen={isOpenShowOrder} onClose={onCloseShowOrder}>
        <ModalOverlay />
        {selectedOrder ? (
          <ModalContent>
            <ModalHeader>Order Details: { }</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Product Name</Th>
                    <Th>Quantity</Th>
                    <Th>Size</Th>
                    <Th>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedOrder.items.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.title}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{item.size}</Td>
                      <Td>{item.price}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              {/* <Button colorScheme="blue" mr={3} onClick={handleUpdatePost}>
                Update
              </Button> */}
              <Button onClick={onCloseShowOrder}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        ) : (null)}
      </Modal>
    </Box>
  );
};

export default OrdersTable;