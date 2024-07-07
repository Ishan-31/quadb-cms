import React, { useEffect, useState } from "react"
import { Button, Heading, SimpleGrid, Stack, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { AiFillDelete } from "react-icons/ai"
import { getProductById, updateProduct, updateProductInventory } from "../../api/product"
import BaseLayout from '../../layout/BaseLayout'
import { supabase } from '../../utils/supabaseClient'

function DynamicProductPage(props) {
  const { id } = props
  const toast = useToast()
  const [image, setImage] = useState(null)
  const [fl, setFl] = useState(null)
  const [longDescription, setLongDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [images, setImages] = useState([])
  const [inventory, setInventory] = useState([])

  const handleImageUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp|\.svg)$/i;

    if (!allowedExtensions.exec(file.name)) {
      alert("Error: Please choose a file with a valid image format (jpg, jpeg, png, webp, svg).");
      event.target.value = "";
      return;
    }

    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
    setFl(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fl) return

    const path = `products/${fl.name}+${Date.now()}`
    const { data, error } = await supabase.storage.from('images').upload(path, fl)

    if (error) {
      console.error(error)
    } else {
      console.log('File uploaded successfully:', data)
      const { data: url, error: err } = supabase.storage.from('images').getPublicUrl(path)
      if (err) {
        console.error(err)
        return
      }
      setImage(null)
      setFl(null)
      let newImages = [...images, url.publicUrl]
      await handleSaveImageDetailsToDB(newImages)
    }
  }

  const handleSaveImageDetailsToDB = async (totalImages) => {
    try {
      let body = {
        images: totalImages
      }
      const res = await updateProduct(id, body)
      if (res.status === 200) {
        toast({
          title: "Gallery Updated.",
          description: "We've updated your gallery description.",
          position: "top-right",
          status: "success",
          duration: 3000,
        })
        setImages(res.data.data.images)
      }
    }
    catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Image save error.",
      })
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    if (name === 'longDescription') {
      setLongDescription(value)
    }
    else if (name === 'shortDescription') {
      setShortDescription(value)
    }
  }

  const handleFetchProductData = async () => {
    try {
      const res = await getProductById(id)
      if (res.data) {
        setShortDescription(res.data.data.shortDescription)
        setLongDescription(res.data.data.longDescription)
        setImages(res.data.data.images)
        setInventory(res.data.data.inventory)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleUpdateInventory = async (size, stock) => {
    try {
      let newInventory = [...inventory]
      newInventory.map((item) => {
        if (item.size === size) {
          item.stock = stock
        }
      })
      setInventory(newInventory)
      let body = {
        inventory: newInventory
      }
      const res = await updateProductInventory(id, inventory)
      if (res.status === 200) {
        toast({
          title: "Inventory Updated.",
          description: "We've updated your inventory.",
          position: "top-right",
          status: "success",
          duration: 3000,
        })
      }
    }
    catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Error while updating inventory.",
        position: "top-right",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleUpdateGallery = async () => {
    try {
      let body = {
        description: description
      }
      const res = await updateGalleryById(body)
      if (res.status === 200) {
        toast({
          title: "Gallery Updated.",
          description: "We've updated your gallery description.",
          position: "top-right",
          status: "success",
          duration: 3000,
        })
      }
    }
    catch (err) {
      console.error(err)
    }
  }
  const handleDeleteImage = async (index) => {
    try {
      let tempImages = [...images]
      tempImages.splice(index, 1)
      let body = {
        images: tempImages
      }
      const res = await updateGalleryById(body)
      if (res.status === 200) {
        toast({
          title: "Image Deleted.",
          description: "We've deleted your image.",
          position: "top-right",
          status: "success",
          duration: 3000,
        })
        setImages(tempImages)
      }
    }
    catch (err) {
      toast({
        title: "Error.",
        description: "We've deleted your image.",
        position: "top-right",
        status: "error",
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    handleFetchProductData()
  }, [])

  return (
    <BaseLayout>
      <Stack direction='row'
        justify={'flex-end'}
        align={'center'}
        position={'sticky'}
        top={0}
        bg={'white'}
        px={4}
        py={2}
        rounded={'md'}
        zIndex={2}
        shadow={'md'}
      >
        <input
          id="image-upload"
          type="file"
          accept=".jpg, .jpeg, .png, .webp, .svg"
          onChange={handleImageUpload}
          className="border border-gray-700 p-2 rounded mb-3"
        />
        {image && (
          <>
            <img src={image} alt="Uploaded Image" className="w-full object-contain h-[60px] mb-3" />
            <Button
              colorScheme='blue'
              variant='solid'
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button>
              Cancel
            </Button>
          </>
        )}
      </Stack>
      <Stack>
        <Heading size={'md'}>Inventory</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Size</Th>
                <Th>Stock</Th>
                <Th>Update</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                inventory.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.size}</Td>
                    <Td
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateInventory(item.size, e.target.innerText)}
                    >{item.stock}</Td>
                    <Td>
                      <Button
                        colorScheme='blue'
                        variant='solid'
                        onClick={() => handleUpdateInventory(item.size, item.stock)}>
                        Update
                      </Button>
                    </Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
      <Stack
        shadow={'md'}
        rounded={'md'}
        p={5}
        justify={'space-evenly'}
        direction={['column', 'row', 'row']} spacing={5}>
        <Stack
          w={['100%', '100%', '100%']}
          direction={['column', 'column', 'column']}
        >
          <Textarea
            h='40'
            name="longDescription"
            placeholder="Add description"
            value={longDescription}
            onChange={handleOnChange}
            size='md'
          />
          <Textarea
            h='40'
            name="shortDescription"
            placeholder="Add description"
            value={shortDescription}
            onChange={handleOnChange}
            size='md'
          />
          <Button
            colorScheme='blue'
            variant='solid'
            onClick={() => handleUpdateGallery()}>
            Update
          </Button>
        </Stack>
        <Stack
          w={['100%', '100%', '100%']}
          direction={['column', 'column', 'column']}>
          <Text
            fontSize={'xl'}
            fontWeight={'bold'}
            color={'gray.600'}
            align={'center'}
          >
            Product Images
          </Text>
          <SimpleGrid
            columns={[1, 2, 2, 3]} p={5} spacing={2}>
            {images.map((image, index) => (
              <Stack key={index}>
                <img
                  className="relative overflow-hidden object-cover w-72 h-full transform transition-all ease-out duration-500 hover:scale-105 rounded-md"
                  key={index} src={image} alt={''}
                />
                <Stack>
                  <Button
                    w='max-content'
                    colorScheme='blue'
                    variant='solid'
                    onClick={() => handleDeleteImage(index)}>
                    <AiFillDelete />
                  </Button>
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </BaseLayout>
  )
}


export default DynamicProductPage

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  const { id } = ctx.params
  return {
    props: {
      id
    }
  }
}