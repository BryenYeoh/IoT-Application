import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export async function alerts(title, html, icon) {
  const MySwal = withReactContent(Swal);
  var inputHtml = document.createElement("i");
  inputHtml.innerHTML = html;

  const response = await MySwal.fire({
    title: icon,
    html: html,
    icon: icon,
    showConfirmButton: true,
  });
  return response;
}

export const icons = {
  success: "success",
  error: "error",
};

export const title = {
  success: "Success!",
  error: "Error!",
};
