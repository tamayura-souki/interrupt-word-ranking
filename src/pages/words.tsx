import React from 'react'
import firebase from 'firebase/app'
import {auth, database} from '../config/firebase'
import AdminForm from './words-components/admin-form'
import UserForm from './words-components/user-form'

type AdminData = {
	isAdmin: boolean
}

type WordsState = {
	isAdmin:boolean,
	uid: string
}

class Words extends React.Component<{}, WordsState> {
	constructor(props:any){
		super(props)
		this.state = {
			isAdmin: false,
			uid : ""
		}
	}

	componentDidMount() {
		auth.onAuthStateChanged(user => {
			if(user != null){
				database.collection("admin")
					.doc(user.uid).get().then(snap => {
					const adminData = snap.data() as AdminData
					this.setState({
						isAdmin : typeof adminData != "undefined" && adminData.isAdmin,
						uid: user.uid
					})
				})
			} else {
				this.setState({isAdmin:false, uid:""})
			}
		})
	}

	render() {
		const form = (this.state.isAdmin) ?	<AdminForm/>
			:  ((this.state.uid) ? <UserForm uid={this.state.uid}/>
			: null)

		return (
			<>
				<h1>words</h1>
				<div className="form">{form}</div>
			</>
		)
	}
}

export default Words