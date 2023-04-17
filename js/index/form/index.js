import { parseGetParamsUpdateForm } from "@/js/index/form/utils";

function onPageParsed() {
  const urlSearchParams = new URLSearchParams(
    window.location.search.substring(1)
  );
  parseGetParamsUpdateForm(urlSearchParams);
}

onPageParsed();
