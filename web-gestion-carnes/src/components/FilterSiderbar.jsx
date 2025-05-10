"use client"


export default function FilterSidebar({ changeFilters }) {
	return (
		<div>
			<CommonFilterPannel>
				<GroupFilter />
			</CommonFilterPannel>
			<CommonFilterPannel>
				<ValidationStateFilter />
			</CommonFilterPannel>
			<CommonFilterPannel>
				<AcademicYearFilter />
			</CommonFilterPannel>
			<CommonFilterPannel>
				<PrintedStateFilter />
			</CommonFilterPannel>
		</div>
	);
}

function CommonFilterPannel() {

	return (
		<div></div>
	);
}

function GroupFilter() {
	return (
		<div></div>
	);
}

function ValidationStateFilter() {
	return (
		<div></div>
	);
}

function AcademicYearFilter() {
	return (
		<div></div>
	);
}

function PrintedStateFilter() {
	return (
		<div></div>
	);
}