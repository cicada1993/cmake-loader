cmake_minimum_required(VERSION 3.8)

project(cpptest VERSION 1.0)
message(STATUS "CMake is running on ${CMAKE_HOST_SYSTEM_NAME}")
# 设置变量root_dir 值为CMakeLists.txt文件所在目录路径
set(root_dir ${CMAKE_CURRENT_SOURCE_DIR})

message(STATUS "root_dir：${root_dir}")

add_executable(cpptest main.cpp)
set_target_properties(cpptest PROPERTIES LINK_FLAGS "-s WASM=1 -s ENVIRONMENT=web -s BUILD_AS_WORKER=0 -s MODULARIZE=1 -s EXPORT_NAME=cpptest")