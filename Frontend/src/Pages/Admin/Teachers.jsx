import React from 'react'
import Sidebar from '../../Components/Sidebar'
import TeachersTable from '../../Components/TeachersTable'  // Updated component import

const Teachers = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <TeachersTable />
      </div>
    </>
  )
}

export default Teachers
