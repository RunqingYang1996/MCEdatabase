let data;
let currentData;
let materialData = [];

function readCSV() {
  var fileInput = document.getElementById('csvFile');
  var file = fileInput.files[0];
  Papa.parse(file, {
    header: true,
    complete: function(results) {
      data = results.data;
      currentData = data;
    }
  });
}

function displayData(dataToDisplay) {
  var outputDiv = document.getElementById('output');
  // Clear the output div
  outputDiv.innerHTML = '';

  if (dataToDisplay.length > 0) {
    const table = document.createElement('table');

    // Create table header
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
      <th>#</th>
      <th>Material</th>
      <th>Magnetic Entropy Change</th>
      <th>Magnetic Field</th>
      <th>Curie Temperature</th>
      <th>MPID</th>
      <th>Reference</th>
    `;
    table.appendChild(tableHeader);

    // Add material data to the table
    dataToDisplay.forEach((material, index) => {
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${index + 1}</td>
        <td class="td1">${material.materialName}</td>
        <td>${material.entropy} J/(kg·K)</td>
        <td>${material.mf}</td>
        <td>${material.tc} K</td>
        <td><a href="https://next-gen.materialsproject.org/materials/${material.mpid}" target="_blank">${material.mpid}</a></td>
        <td>
          <button onclick="showReference('${material.at}', '${material.st}', '${material.doi}')">Show (Hide)</button>
          <div class="reference-text" style="display: none;">
            <p>Article Title: ${material.at}</p>
            <p>Source Title: ${material.st}</p>
            <p>DOI: ${material.doi}</p>
          </div>
        </td>
      `;
      table.appendChild(tableRow);
    });

    outputDiv.appendChild(table);
  } else {
    const notFoundMessage = document.createElement('p');
    notFoundMessage.textContent = 'Material not found!';
    outputDiv.appendChild(notFoundMessage);
  }
}


function searchMaterial(query) {
  const elements = query.split(',').map((element) => element.trim());
  materialData = currentData.filter((row) => {
    return elements.every((element) => {
      const re = new RegExp(element + "[A-Z2-9]");
      const re1 = new RegExp(element + "\\b");
      return row.Material.includes(element) && (re.test(row.Material) || re1.test(row.Material));
    });
  }).map((material) => {
    return {
      materialName: material.Material,
      entropy: material['Magnetic Entropy Change'] || 'NaN',
      mf: material['Magnetic Field'] || 'NaN',
      tc: material['Curie Temperature'] || 'NaN',
      mpid: material.mpid || 'NaN',
      at: material['Article Title'] || 'NaN',
      st: material['Source Title'] || 'NaN',
      doi: material.DOI || 'NaN'
    };
  });
  displayData(materialData);
}

function searchFormula(query) {
  materialData = currentData.filter((row) => {
    return row.Material === query;
  }).map((material) => {
    return {
      materialName: material.Material,
      entropy: material['Magnetic Entropy Change'] || 'NaN',
      mf: material['Magnetic Field'] || 'NaN',
      tc: material['Curie Temperature'] || 'NaN',
      mpid: material.mpid || 'NaN',
      at: material['Article Title'] || 'NaN',
      st: material['Source Title'] || 'NaN',
      doi: material.DOI || 'NaN'
    };
  });
  displayData(materialData);
}


function searchTemp(query) {
  const interval = query.split('-').map((element) => element.trim());
  materialData = currentData.filter((row) => {
    const tc = parseFloat(row['Curie Temperature']);
    return !isNaN(tc) && parseFloat(interval[0]) <= tc && tc <= parseFloat(interval[1]);
  }).map((material) => {
    return {
      materialName: material.Material,
      entropy: material['Magnetic Entropy Change'] || 'NaN',
      mf: material['Magnetic Field'] || 'NaN',
      tc: material['Curie Temperature'] || 'NaN',
      mpid: material.mpid || 'NaN',
      at: material['Article Title'] || 'NaN',
      st: material['Source Title'] || 'NaN',
      doi: material.DOI || 'NaN'
    };
  });

  // Sort the materialData array by tc in ascending order
  materialData.sort((a, b) => parseFloat(a.tc) - parseFloat(b.tc));

  displayData(materialData);
}


function searchTM(query) {
  const interval = query.split('-').map((element) => element.trim());
  materialData = currentData.filter((row) => {
    const tm = parseFloat(row['Total Magnetization']);
    return !isNaN(tm) && parseFloat(interval[0]) <= tm && tm <= parseFloat(interval[1]);
  }).map((material) => {
    return {
      materialName: material.Material,
      entropy: material['Magnetic Entropy Change'] || 'NaN',
      mf: material['Magnetic Field'] || 'NaN',
      tc: material['Curie Temperature'] || 'NaN',
      mpid: material.mpid || 'NaN',
      at: material['Article Title'] || 'NaN',
      st: material['Source Title'] || 'NaN',
      doi: material.DOI || 'NaN'
    };
  });
  displayData(materialData);
}

function handleButtonClick(buttonId) {
  const button = document.getElementById(buttonId);
  button.classList.add('selected');

  // Remove the "selected" class after a short delay (300 milliseconds)
  setTimeout(() => {
    button.classList.remove('selected');
  }, 300);
}

function showReference(articleTitle, sourceTitle, doi) {
  const referenceTextDiv = event.target.nextElementSibling;
  if (referenceTextDiv.style.display === 'none') {
    referenceTextDiv.style.display = 'block';
  } else {
    referenceTextDiv.style.display = 'none';
  }
}

document.getElementById('searchButton1').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  searchMaterial(query);
  handleButtonClick('searchButton1');
});

document.getElementById('searchButton2').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  searchFormula(query);
  handleButtonClick('searchButton2');
});

document.getElementById('searchButton3').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  searchTemp(query);
  handleButtonClick('searchButton3');
});

document.getElementById('searchButton4').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  searchTM(query);
  handleButtonClick('searchButton4');
});
