import { centers } from "@/database/centers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wilayaId = url.searchParams.get('wilaya_id');
  const wilayaName = url.searchParams.get('wilaya_name');
  const communeId = url.searchParams.get('commune_id');
  const communeName = url.searchParams.get('commune_name');

  let filteredCenters = centers;

  if (wilayaId) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_id === parseInt(wilayaId)); // Parse to integer
  }

  if (wilayaName) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_name.toLowerCase() === wilayaName.toLowerCase()); // Case-insensitive
  }

  if (communeId) {
    filteredCenters = filteredCenters.filter(center => center.commune_id === parseInt(communeId)); // Parse to integer
  }

  if (communeName) {
    filteredCenters = filteredCenters.filter(center => center.commune_name.toLowerCase() === communeName.toLowerCase()); // Case-insensitive
  }

  return Response.json([...filteredCenters]); // Return the filtered centers
}

