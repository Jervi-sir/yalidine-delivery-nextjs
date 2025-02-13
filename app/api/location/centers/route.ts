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

  return Response.json([...filteredCenters]); // Return the filtered centers
}

