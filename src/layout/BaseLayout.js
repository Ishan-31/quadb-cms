import Sidebar from "@/components/Sidebar";
import { Box } from "@chakra-ui/react";
import { SidebarContext } from "@/context/SidebarContext";
import React, { useContext } from 'react'


const BaseLayout = ({ children }) => {
  const { isCollapsed } = useContext(SidebarContext)

  return (
    <Box>
      <div className="layout">
        <Sidebar />
        <main className="layout__main-content">
          <Box
            p={5}
            w={isCollapsed ? '100%' : '85vw'}
            h='100vh'
            bg={'white'}
            __css={{
              overflowY: 'scroll',
              overflowX: 'scroll',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '5px',
              },
              '&::-webkit-scrollbar-track': {
                bg: 'gray.100',
              },
              '&::-webkit-scrollbar-thumb': {
                bg: 'gray.300',
                borderRadius: '24px',
              },
            }}
          >
            {children}
          </Box>
        </main>
      </div>
    </Box>
  );
};

export default BaseLayout;
