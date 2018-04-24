'use strict';
const HOLDINGS_URL = 'holdings';

const Holdings = {
	get: function() {
		return fetch(HOLDINGS_URL, {
			headers: _getAuthHeaders()
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		});
	},
	add: function(data) {
		return fetch(HOLDINGS_URL, {
			method: 'POST',
			headers: _getAuthHeaders(),
			body: JSON.stringify(data)
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		});
	},
	update: function(data) {
		return fetch(`${HOLDINGS_URL}/${data.id}`, {
			method: 'PUT',
			headers: _getAuthHeaders(),
			body: JSON.stringify(data)
		}).then(res => {
			if (res.ok) {
				return;
			}
		});
	},
	delete: function(id) {
		return fetch(`${HOLDINGS_URL}/${id}`, {
			method: 'DELETE',
			headers: _getAuthHeaders()
		}).then(res => {
			if (res.ok) {
				return;
			}
		});
	}
};

function _getAuthHeaders() {
	const token = localStorage.getItem('token');
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};
}
