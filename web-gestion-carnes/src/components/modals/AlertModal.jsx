import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';

export default function SimpleSnackbar({ alertText, onClose }) {

	useEffect(() => {
		setOpen(true);

	}, []);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
		onClose();
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={5000}
			onClose={handleClose}
			message={alertText}
		/>
	);
}
