import React, { useState } from "react";
import "./App.css";
import 'antd/dist/antd.css';
import {
  Typography,
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from "antd";
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const residences = [
  {
    value: "chicago",
    label: "Chicago",
    children: [
      {
        value: "illinois",
        label: "Illinois",
        children: [
          {
            value: "fraggle drive",
            label: "Fraggle Drive",
          },
        ],
      },
    ],
  },
  {
    value: "arizona",
    label: "Arizona",
    children: [
      {
        value: "yuma",
        label: "Yuma",
        children: [
          {
            value: "martha street",
            label: "Martha Street",
          },
        ],
      },
    ],
  },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function App() {
  const [form] = Form.useForm();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");

  const onFinish = () => {
    const values = { email, password, nickname, phoneNumber, website };

		axios
			.post(
				process.env.REACT_APP_SHEET_URL!,
				values
			)
			.then((response) => {
				console.log(response);
			});
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="81">+81</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

  const onWebsiteChange = (value: string) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  return (
    <>
      <Typography className="title-container">
        <Title level={2} className="title">React Ant Design - GoogleSheet</Title>
      </Typography>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["chicago", "illinois", "fraggle drive"],
          prefix: "1",
        }}
        scrollToFirstError
        style={{ marginTop: '50px' }}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input onChange={e => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your nickname!",
              whitespace: true,
            },
          ]}
        >
          <Input onChange={e => setNickname(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="residence"
          label="Habitual Residence"
          rules={[
            {
              type: "array",
              required: true,
              message: "Please select your habitual residence!",
            },
          ]}
        >
          <Cascader options={residences} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} onChange={e => setPhoneNumber(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: true, message: "Please input website!" }]}
        >
          <AutoComplete
            options={websiteOptions}
            onChange={onWebsiteChange}
            placeholder="website"
          >
            <Input onChange={e => setWebsite(e.target.value)} />
          </AutoComplete>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default App;
