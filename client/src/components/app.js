import { h } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';

function getPilots() {
	return fetch('http://localhost:3000/pilots')
		.then(response => {
			console.log(response);
			return response;
		})
		.then(response => response.json());
}

const App = () => {
	const [pilots, setPilots] = useState([]);

	const updatePilots = useCallback(
		() => {
			getPilots().then(data => {
				setPilots(data);
				setTimeout(() => {
					updatePilots();
				}, 2000);
		})}, [setPilots]);


	useEffect(() => {
		updatePilots();
	}, [updatePilots]);

	return (
		<div id="app">
			<main>
				<div>
					<h1>Pilots</h1>
					<div>
						{pilots.map(pilot => <Pilot key={pilot.pilotId} pilot={pilot} />)}
					</div>
				</div>
			</main>
		</div>
	);
};

const Pilot = ({ pilot }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<h2 onClick={() => setIsOpen(!isOpen)}>{pilot.firstName} {pilot.lastName} </h2>
			{isOpen &&
			<>
				<p>{pilot.email}</p>
				<p>Closest distance to nest: {Math.round(pilot.closestDistanceToNest / 1000)}m</p>
				<p>Last seen: {new Date(pilot.updatedAt).toISOString()}</p>
			</>
			}
		</div>
	);
}

export default App;
