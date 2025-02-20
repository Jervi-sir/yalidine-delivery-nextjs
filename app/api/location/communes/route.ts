import { communes } from "@/database/communes";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wilaya_id = url.searchParams.get('wilaya_id');
  const wilaya_name = url.searchParams.get('wilaya_name');
  const has_stop_desk: boolean = url.searchParams.get('has_stop_desk') === 'true' ? true : false;
  const is_deliverable: boolean = url.searchParams.get('is_deliverable') === 'true' ? true : false;
  const communeName = url.searchParams.get('name');

  let filteredCommunes = communes;

  if (wilaya_id) {
    filteredCommunes = filteredCommunes.filter(center => center.wilaya_id === parseInt(wilaya_id)); // Parse to integer
  }

  if (wilaya_name) {
    filteredCommunes = filteredCommunes.filter(center => center.wilaya_name.toLowerCase() === wilaya_name.toLowerCase()); // Case-insensitive
  }

  if (has_stop_desk) {
    filteredCommunes = filteredCommunes.filter(center => center.has_stop_desk === has_stop_desk); // Parse to integer
  }

  if (is_deliverable) {
    filteredCommunes = filteredCommunes.filter(center => center.is_deliverable === is_deliverable); // Parse to integer
  }

  if (communeName) {
    filteredCommunes = filteredCommunes.filter(center => center.name.toLowerCase() === communeName.toLowerCase()); // Case-insensitive
  }

  return Response.json([...filteredCommunes]); // Return the filtered centers

}


