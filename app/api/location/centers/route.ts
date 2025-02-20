import { centers } from "@/database/centers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wilaya_id = url.searchParams.get('wilaya_id');
  const wilaya_name = url.searchParams.get('wilaya_name');

  const commune_id = url.searchParams.get('commune_id');
  const commune_name = url.searchParams.get('commune_name');

  let filteredCenters = centers;

  if (wilaya_id) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_id === parseInt(wilaya_id)); // Parse to integer
  }

  if (wilaya_name) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_name.toLowerCase() === wilaya_name.toLowerCase()); // Case-insensitive
  }

  if (commune_id) {
    filteredCenters = filteredCenters.filter(center => center.commune_id === parseInt(commune_id)); // Parse to integer
  }

  if (commune_name) {
    filteredCenters = filteredCenters.filter(center => center.commune_name.toLowerCase() === commune_name.toLowerCase()); // Case-insensitive
  }

  // Format the output
  const formattedCenters = filteredCenters.map(center => ({
    id: center.center_id,
    name: center.name,
    address: center.address,
    gps: center.gps,
    commune_id: center.commune_id,
    commune_name: center.commune_name,
    wilaya_id: center.wilaya_id,
    wilaya_name: center.wilaya_name,
  }));


  return Response.json([...formattedCenters]); // Return the filtered centers
}

