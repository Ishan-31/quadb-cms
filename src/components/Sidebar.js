import { useContext } from "react"
import { SidebarContext } from "../context/SidebarContext"
import { useRouter } from "next/router"
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react"
import { AiOutlineHome } from "react-icons/ai";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { withCookies } from "react-cookie"
import { useAuth } from "@/context/AuthContext"
import { RiLogoutBoxRLine, RiProductHuntFill } from 'react-icons/ri'
import { BiSolidPackage } from "react-icons/bi"
import Image from "next/image";

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
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

const Sidebar = () => {
  const toast = useToast()
  const router = useRouter();
  const { logout } = useAuth()
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box position='relative'>
      <button className="collapsed__btn" onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <Stack
        justify={["flex-start", "flex-start", "space-between"]}
        position="sticky"
        top="0"
        left="0"
        w={isCollapsed ? "5rem" : ["5rem", "5rem", "15vw"]}
        h={["100%"]}
        as="aside"
        className="sidebar"
        data-collapse={isCollapsed}
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
          },
        }}>
        <Stack>
          <Stack
            position={"sticky"}
            top={"0"}
            zIndex={"2"}
            mb={8}
            py={1}
            rounded={"xl"}
            textAlign={"center"}>
            {isCollapsed ?
              (
                <Box w='50px' h='40px'>
                  <Image
                    src={"https://looko-frontend-three.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLOOKO-LOGO.97b05474.png&w=256&q=75"} alt="logo"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    width={50} height={50} />
                </Box>
              )
              :
              (
                <Box w='100%' h='44px'>
                  <Image
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    src={"https://looko-frontend-three.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLOOKO-LOGO.97b05474.png&w=256&q=75"} alt="logo"
                    width={40} height={40} />
                </Box>
              )
            }
          </Stack>
          <Stack as={'ul'} style={{
            listStyle: "none",
          }}>
            {sidebarItems.map(({ name, href, icon: Icon }) => {
              return (
                <Stack
                  direction='row' align='center' as={'li'} key={name}
                  cursor='pointer'
                  className={`sidebar__link ${router.pathname === href ? "sidebar__link--active" : ""}`}
                  onClick={() => router.push(href)}>
                  <span className="sidebar__icon">
                    <Icon />
                  </span>
                  <span className="sidebar__name">{name}</span>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
        <Button
          leftIcon={<RiLogoutBoxRLine
            style={{
              marginLeft: isCollapsed ? "0.5rem" : "0",
            }}
          />}
          colorScheme="red"
          variant="solid"
          onClick={handleLogout}>
          {isCollapsed ? "" : "Logout"}
        </Button>
      </Stack>
    </Box>
  );
};

export default withCookies(Sidebar)


