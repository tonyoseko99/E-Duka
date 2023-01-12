import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../API/Api";
import { List, Card, Image, Typography } from "antd";
const { Meta } = Card;

const Products = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getAllProducts().then((res) => {
      console.log("res", res.products);
      setItems(res.products);
    });
  }, []);

  return (
    <div className="products">
      <List
        grid={{ column: 3 }}
        renderItem={(product, index) => {
          return (
            <Card
              title={product.title}
              key={index}
              cover={
                <Image className="item-card-image" src={product.thumbnail} />
              }
            >
              <Card.Meta
                title={
                  <Typography.Paragraph>
                    Price: ${product.price}
                    <Typography.Text delete type="danger">
                      {" "}
                      $
                      {parseFloat(
                        product.price /
                          (1 - product.discountPercentage / 100).toFixed(2)
                      ).toFixed(2)}
                    </Typography.Text>
                  </Typography.Paragraph>
                }
                description={
                  <Typography.Paragraph
                    ellipsis={{
                      rows: 2,
                      expandable: true,
                      symbol: "Show More",
                    }}
                  >
                    {product.description}
                  </Typography.Paragraph>
                }
              ></Card.Meta>
            </Card>
          );
        }}
        dataSource={items}
      ></List>
    </div>
  );
};

export default Products;
