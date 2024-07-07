import React, { useState } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Button,
    useToast,
} from '@chakra-ui/react';
import BaseLayout from '../../layout/BaseLayout';
import { createProduct } from '../../api/product';
import { useRouter } from 'next/router';

function AddProduct() {
    const router = useRouter();
    const toast = useToast({
        position: 'top-right',
        duration: 2000,
    });
    // Define states for your form fields
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        shortDescription: '',
        longDescription: '',
        collectionType: 'aneek', // Default value for the dropdown
    });

    // Function to handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // You can perform further actions like sending the data to a server here
            console.log('Form data submitted:', productData);
            const res = await createProduct(productData);
            router.push(`/products/${res.data.data._id}`);
            setProductData({
                title: '',
                price: '',
                shortDescription: '',
                longDescription: '',
                collectionType: 'aneek', // Reset to the default value
            });
        }
        catch (err) {
            console.log(err);
            toast({
                title: 'Error creating product',
                status: 'error',
                description: err.message,
            });
        }
    };

    return (
        <BaseLayout>
            <Box>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel htmlFor="title">Title:</FormLabel>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={productData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="price">MRP:</FormLabel>
                        <Input
                            type="text"
                            id="price"
                            name="price"
                            value={productData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="price">Discount Percent</FormLabel>
                        <Input
                            type="text"
                            id="price"
                            name="price"
                            value={productData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="price">Actual Price</FormLabel>
                        <Input
                            type="text"
                            id="price"
                            name="price"
                            value={productData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="longDescription">About the book:</FormLabel>
                        <Textarea
                            id="longDescription"
                            name="longDescription"
                            value={productData.longDescription}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="shortDescription">Specifications:</FormLabel>
                        <Input
                            type="text"
                            id="shortDescription"
                            name="shortDescription"
                            value={productData.shortDescription}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>

                    <Button my={5} colorScheme='green' type="submit">Create Product</Button>
                </form>
            </Box>
        </BaseLayout>
    );
}

export default AddProduct;
