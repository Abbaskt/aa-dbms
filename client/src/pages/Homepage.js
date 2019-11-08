import React from "react";
import {
	Menu,
	Icon,
	Typography,
	Layout,
	Input,
	Button,
	Row,
	Col,
	Carousel,
	Dropdown,
	Card
} from "antd";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Cookies from "universal-cookie";

import Cards from "./Cards";
import "./Homepage.css";
import Nav from "./Navigator";

const { Tile } = Typography;
const { Header, Content, Footer } = Layout;
const cookies = new Cookies();

class Homepage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productList: [],
			category: "All",
			userid: null,
			loggedin: false
		};
		this.handleMenuClick = this.handleMenuClick.bind(this);

		try {
			this.state.userid = cookies.get("userid");
			if (this.state.userid != undefined) this.state.loggedin = true;
			// this.forceUpdate()
		} catch (e) {
			console.log(e);
		}
	}

	componentDidMount() {
		fetch("/api/card")
			.then(res => {
				return res.json();
			})
			.then(data => {
				// this.productList.push(data[0])
				let tempProduct = [];
				data.map(prod => {
					// console.log(prod);
					tempProduct.push(prod);
				});
				this.setState({
					productList: tempProduct
				});
			});
	}
	handleMenuClick(e) {
		this.setState({
			category: String(e.key)
		});
		console.log(this.state.category);
	}

	productArea = () => {
		return <Cards product={this.state.productList} id={this.state.userid} />;
	};

	render() {
		const menu = (
			<Menu>
				<Menu.Item key="Mobiles" onClick={this.handleMenuClick}>
					<Icon type="mobile" /> Mobiles
				</Menu.Item>
				<Menu.Item key="Laptop" onClick={this.handleMenuClick}>
					<Icon type="laptop" /> Laptops
				</Menu.Item>
				<Menu.Item key="Television" onClick={this.handleMenuClick}>
					<Icon type="desktop" /> Televisions
				</Menu.Item>
				<Menu.Item key="Headphones" onClick={this.handleMenuClick}>
					<Icon type="sound" /> Headphones
				</Menu.Item>
				<Menu.Item key="Consoles" onClick={this.handleMenuClick}>
					<Icon type="play-circle" /> Consoles
				</Menu.Item>
			</Menu>
		);
		return (
			<Layout className="layout">
				<Nav
					product={this.state.productList}
					accType="buyer"
					loggedin={this.state.loggedin}
				/>
				<Content style={{ padding: "0 10px" }}>
					<div align="center" style={{ padding: "10px" }}>
						Categories :{" "}
						<Dropdown.Button
							overlay={menu}
							trigger={["click"]}
							icon={<Icon type="down" />}
						>
							All
						</Dropdown.Button>
					</div>
					<div style={{ background: "#fff", padding: 24 }}>
						<Carousel autoplay style={{ padding: "10px 0" }}>
							<div align="center">
								<img
									src={require("../Images/mobile.jpg")}
									alt="Please display"
									height="400"
									width="1500"
								/>
							</div>
							<div align="center">
								<img
									src={require("../Images/laptop.jpg")}
									alt="Please display"
									height="400"
									width="1500"
								/>
							</div>
							<div align="center">
								<img
									src={require("../Images/television.jpg")}
									alt="Please display"
									height="400"
									width="1500"
								/>
							</div>
							<div align="center">
								<img
									src={require("../Images/headphone.jpg")}
									alt="Please display"
									height="400"
									width="1500"
								/>
							</div>
							<div align="center">
								<img
									src={require("../Images/consoles.jpg")}
									alt="Please display"
									height="400"
									width="1500"
								/>
							</div>
						</Carousel>
						<this.productArea />
					</div>
				</Content>
			</Layout>
		);
	}
}
export default Homepage;
