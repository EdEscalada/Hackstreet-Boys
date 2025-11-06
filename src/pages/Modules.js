import React from "react";
import styles from "./Modules.module.css";
import forloops from "./Modules/forloops";
import whileloop from "./Modules/whileloop";
import dowhile from "./Modules/dowhile";
import foreach from "./Modules/foreach";
import controlstatements from "./Modules/controlstatements";

// Only include title & pdfUrl
const moduleList = [
  { title: forloops.title, pdfUrl: forloops.pdfUrl, ...forloops },
  { title: whileloop.title, pdfUrl: whileloop.pdfUrl, ...whileloop },
  { title: dowhile.title, pdfUrl: dowhile.pdfUrl, ...dowhile },
  { title: foreach.title, pdfUrl: foreach.pdfUrl, ...foreach },
  { title: controlstatements.title, pdfUrl: controlstatements.pdfUrl, ...controlstatements },
  // add more modules here
];

export default function Modules({ onNavigate }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>List of Modules</h1>

      <ul className={styles.moduleList}>
        {moduleList.map((mod, index) => (
          <li
            key={index}
            className={styles.moduleLink}
            onClick={() => onNavigate("module", { module: mod })} // navigate to builder
          >
            {mod.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
