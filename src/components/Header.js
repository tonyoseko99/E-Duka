import React, { useEffect, useState, useReducer } from "react";
import { getCart } from "../API/Api";
import { useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DownCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Table,
  Typography,
} from "antd";

const items = [
  {
    label: "Home",
    key: "",
    icon: <ShoppingOutlined />,
  },

  {
    label: "Categories",
    icon: <DownCircleOutlined />,
    children: [
      {
        type: "group",
        label: "Women",
        children: [
          {
            label: "Dresses",
            key: "womens-dresses",
          },
          {
            label: "Shoes",
            key: "womens-shoes",
          },
          {
            label: "Watches",
            key: "womens-watches",
          },
          {
            label: "Bags",
            key: "womens-bags",
          },
        ],
      },
      {
        type: "group",
        label: "Men",
        children: [
          {
            label: "Shirts",
            key: "mens-shirts",
          },
          {
            label: "Shoes",
            key: "mens-shoes",
          },
          {
            label: "Watches",
            key: "mens-watches",
          },
        ],
      },
      {
        type: "group",
        label: "Electronics",
        children: [
          {
            label: "Smartphones",
            key: "smartphones",
          },
          {
            label: "Laptops",
            key: "laptops",
          },
        ],
      },
    ],
  },
];

const Header = () => {
  const navigate = useNavigate();

  const onMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  return (
    <div className="appHeader">
      <Typography.Title level={3} className="logo-text">
        E-Duka
      </Typography.Title>

      <Menu onClick={onMenuClick} mode="horizontal" items={items} />

      <Menu mode="horizontal">
        <Menu.Item key="cart">
          <AppCart />
        </Menu.Item>
        <Menu.Item key="signin">
          <Button type="primary">Sign In</Button>
        </Menu.Item>

        <Menu.Item key="signup">
          <Button>Sign Up</Button>
        </Menu.Item>
      </Menu>
    </div>
  );
};
// appcart component
const AppCart = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCart().then((res) => {
      setCartItems(res.products);
    });
  }, []);

  // function onConfirmOrder
  const onConfirmOrder = (values) => {
    console.log({ values });
    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);
    message.success("Order confirmed!");
  };

  return (
    <>
      <Badge
        count={cartItems.length}
        onClick={() => {
          setCartDrawerOpen(true);
        }}
      >
        <ShoppingCartOutlined /> Cart
      </Badge>
      <Drawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        title="Your Cart"
        contentWrapperStyle={{ width: "100%", maxWidth: "500px" }}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (price) => <span>${price}</span>,
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (quantity, record) => (
                <InputNumber
                  min={0}
                  defaultValue={quantity}
                  onChange={(quantity) => {
                    setCartItems(
                      cartItems.map((item) => {
                        if (item.id === record.id) {
                          return {
                            ...item,
                            quantity,
                            total: quantity * item.price,
                          };
                        }
                        return item;
                      })
                    );
                  }}
                ></InputNumber>
              ),
            },
            {
              title: "Total",
              dataIndex: "total",
              render: (total) => <span>${total}</span>,
            },
          ]}
          dataSource={cartItems}
          summary={(data) => {
            const total = data.reduce((prev, curr) => {
              return prev + curr.total;
            }, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                <Table.Summary.Cell>${total}</Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
        <Button
          type="primary"
          block
          onClick={() => setCheckoutDrawerOpen(true)}
        >
          Checkout
        </Button>
      </Drawer>
      {/* user Drawer */}
      <Drawer
        open={checkoutDrawerOpen}
        onClose={() => {
          setCheckoutDrawerOpen(false);
        }}
      >
        <Form onFinish={onConfirmOrder}>
          <Typography.Title level={4}>Checkout</Typography.Title>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Please input your full name",
              },
            ]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email",
              },
            ]}
          >
            <Input placeholder="name@example.com" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address",
              },
            ]}
          >
            <Input placeholder="address" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number",
              },
            ]}
          >
            <Input placeholder="+254 7xx-xxx-xxx" />
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked disabled>
              Cash on Delivery
            </Checkbox>
          </Form.Item>
          <Button type="primary" block htmlType="submit">
            Confirm Order
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Header;
