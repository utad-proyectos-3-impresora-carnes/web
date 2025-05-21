import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function SimpleSnackbar({ alertText }) {
	const [open, setOpen] = React.useState(false);

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
	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return (
		<Snackbar
			open={open}
			autoHideDuration={5000}
			onClose={handleClose}
			message={alertText}
			action={action}

		/>
	);
}
