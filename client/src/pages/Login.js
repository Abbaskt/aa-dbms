/* eslint-disable */
import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import {
	Icon,
	Typography,
	Layout,
	Form,
	Input,
	Button,
	Row,
	Col,
	message
} from "antd";
import Cookies from "universal-cookie";

import "./Login.css";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;
const cookies = new Cookies();
const cookieTimeout = 30 * 60;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: "Nothing recieved"
		};
	}

	componentDidMount() {}

	success = (type, userid) => {
		message.success("Logged in with User ID " + type);
		cookies.set("userid", userid, { path: "/", maxAge: cookieTimeout });
		cookies.set("type", type, { path: "/", maxAge: cookieTimeout });

		if (type == "admin") {
			cookies.set("auth", "true", { path: "/", maxAge: cookieTimeout });
			this.props.history.push("/admin");
		} else if (type == "buyer") {
			this.props.history.push("/homepage");
		} else if (type == "seller") {
			cookies.set("auth", "true", { path: "/", maxAge: cookieTimeout });
			this.props.history.push("/seller");
		}
	};

	error = () => {
		message.error("Log in unsuccessful");
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let enteredDets = {
					userid: values.userid,
					password: values.password
				};
				var validate = () => {
					fetch("/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json;charset=utf-8"
						},
						body: JSON.stringify(enteredDets)
					})
						.then(res => res.json())
						.then(resp => {
							// console.log(resp);
							if (resp.valid == true) {
								this.success(resp.type, enteredDets.userid);
							} else {
								this.error();
							}
						});
				};
				validate();
			}
		});
	};

	render() {
		let { data } = this.state;

		const { getFieldDecorator } = this.props.form;

		return (
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Content
          style={{
            padding: "75px 50px",
            marginTop: 64,
            textAlign: "center"
          }}
        >
          <Title style={{ fontWeight: 430 }}>Login</Title>
          <Row type="flex" align="center">
            <Col
              span={8}
              style={{
                padding: "60px",
                backgroundColor: "#ffffff",
                borderRadius: "15px"
              }}
            >
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("userid", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your User ID!"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      placeholder="User ID"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Please input your Password!"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Login
                  </Button>
                  <br />
                  Or <Link to="/register">Register now!</Link>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Link to="/homepage">
            <Button type="link" size="large">
              Go Home
            </Button>
          </Link>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          This project is created by Allen and Abbas
        </Footer>
      </Layout>
    );
	}
}

Login = Form.create()(Login);

export default Login;
