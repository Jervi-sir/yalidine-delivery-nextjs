import { communes } from "@/database/communes";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wilayaId = url.searchParams.get('wilaya_id');
  const wilayaName = url.searchParams.get('wilaya_name');
  const hasStopDesk: boolean = url.searchParams.get('has_stop_desk') === 'true' ? true : false;
  const isDeliverable: boolean = url.searchParams.get('is_deliverable') === 'true' ? true : false;
  const communeName = url.searchParams.get('name');

  let filteredCenters = communes;

  if (wilayaId) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_id === parseInt(wilayaId)); // Parse to integer
  }

  if (wilayaName) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_name.toLowerCase() === wilayaName.toLowerCase()); // Case-insensitive
  }

  if (hasStopDesk) {
    filteredCenters = filteredCenters.filter(center => center.has_stop_desk === hasStopDesk); // Parse to integer
  }

  if (isDeliverable) {
    filteredCenters = filteredCenters.filter(center => center.is_deliverable === isDeliverable); // Parse to integer
  }

  if (communeName) {
    filteredCenters = filteredCenters.filter(center => center.name.toLowerCase() === communeName.toLowerCase()); // Case-insensitive
  }

  return Response.json([...filteredCenters]); // Return the filtered centers

}


