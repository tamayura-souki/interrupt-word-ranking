import React from 'react'

import Ranking from './ranking'

class Entrance extends React.Component {
	render() {
		return (
			<>
				<div className="entrance">
					<h1>よそうこ、InterruptWord予想サイトへ</h1>
					<p>このサイトはInterruptRadio内の視聴者参加型企画用につくられました。</p>
					<p>右上からTwitter認証でサインインして、ランキングに挑戦しよう！</p>
				</div>
				<Ranking/>
			</>
		)
	}
}

export default Entrance