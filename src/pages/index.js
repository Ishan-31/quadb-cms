import { useState } from "react"
import BaseLayout from "../layout/BaseLayout"
import PrivateRoute from '../components/PrivateRoute'
import { BiSolidPackage } from "react-icons/bi"
import { RiProductHuntFill } from "react-icons/ri";
import { Box, Flex } from "@chakra-ui/react";


const SidebarCard = ({ name, href, icon: Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box as="a"
      w='20rem'
      h='20rem'
      href={href}
      className={`flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out transform shadow-md ${isHovered ? "scale-105" : ""
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon className="text-4xl mb-2" />
      <span className="text-base">{name}</span>
    </Box>
  );
};

const SidebarCards = () => {
  const sidebarItems = [
    {
      name: "Orders",
      href: "/orders",
      icon: BiSolidPackage,
    },
    {
      name: "Products",
      href: "/products",
      icon: RiProductHuntFill,
    }
  ]
  return (
    <PrivateRoute>
      <BaseLayout>
        <Flex h='90vh' justify={'center'} gap={10} align={'center'}>
          {
            sidebarItems.map((item, index) => (
              <SidebarCard key={index} {...item} />
            ))
          }
        </Flex >
      </BaseLayout >
    </PrivateRoute >
  )
}


export default SidebarCards;
