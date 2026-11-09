export async function load({ url }) {
	const filter = url.searchParams.get('filter');

	// stands in for a slow data request, so a click can land while the filter loads
	if (filter) await new Promise((fulfil) => setTimeout(fulfil, 1500));

	return { filter };
}
