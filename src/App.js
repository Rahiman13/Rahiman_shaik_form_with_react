import React, { useState, useEffect } from 'react';
import './MultiStepForm.css'; // Import CSS file for styling
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import supermanFlying from './superman-flying1.png'; // Import Superman flying gif

const graduationDegrees = [
  { name: 'Bachelor of Technology (BTech)', duration: 4, branches: ['CSE', 'ECE', 'Mechanical', 'Civil'] },
  { name: 'Bachelor of Arts (BA)', duration: 3, branches: ['History', 'Economics', 'Political Science', 'English'] },
  { name: 'Bachelor of Science (BSc)', duration: 3, branches: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] },
  { name: 'Bachelor of Commerce (BCom)', duration: 3, branches: ['Accounts', 'Finance', 'Taxation', 'Marketing'] }
];

const indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

const MultiStepForm = () => {
  const totalSteps = 4; // Total number of steps in the form

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    return storedData ? JSON.parse(storedData) : {
      name: '',
      surname: '',
      mobile: '',
      gender: '',
      email: '',
      permanentAddress: '',
      currentAddress: '',
      pincode: '',
      state: '',
      city: '',
      graduation: '',
      branch: '',
      year: '',
      image: null,
      tenthSchool: '',
      tenthPercentage: '',
      tenthPassOutYear: '',
      interCollege: '',
      interPercentage: '',
      interPassOutYear: ''
    };
  });
  const [errors, setErrors] = useState({});
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supermanProgress, setSupermanProgress] = useState(0);
  const [addMoreClicked, setAddMoreClicked] = useState(0);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  let supermanLeftPosition = `calc(${progress}% + 50px)`; // Adjust the '50px' based on the width of the Superman image

  const stepProgress = [0, 25, 50, 75, 100];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    validateField(name, value);
    if (name === 'graduation') {
      const degree = graduationDegrees.find(degree => degree.name === value);
      setSelectedDegree(degree);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value.includes('@')) {
          error = 'Email must be valid';
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'surname', 'email'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
      return;
    }

    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let storedData = JSON.parse(localStorage.getItem('formData')) || [];
    if (!Array.isArray(storedData)) {
      storedData = [];
    }
    const newData = { ...formData };
    storedData.push(newData);
    localStorage.setItem('formData', JSON.stringify(storedData));

    if (step < totalSteps) {
      // Slowly increase progress until it reaches the next step's progress
      const interval = setInterval(() => {
        setSupermanProgress(prevProgress => {
          const newProgress = prevProgress + 1;
          if (newProgress >= stepProgress[step]) {
            clearInterval(interval);
            setStep(step + 1);
            return stepProgress[step];
          }
          return newProgress;
        });
      }, 100);
    } else {
      // Slowly increase progress until it reaches 100%
      const interval = setInterval(() => {
        setSupermanProgress(prevProgress => {
          const newProgress = prevProgress + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              alert('Form submitted successfully!');
              setStep(1);
              setFormData({
                name: '',
                surname: '',
                mobile: '',
                gender: '',
                email: '',
                permanentAddress: '',
                currentAddress: '',
                pincode: '',
                state: '',
                city: '',
                graduation: '',
                branch: '',
                year: '',
                image: null,
                tenthSchool: '',
                tenthPercentage: '',
                tenthPassOutYear: '',
                interCollege: '',
                interPercentage: '',
                interPassOutYear: ''
              });
              setSupermanProgress(0); // Reset Superman progress after submission
            }, 3000); // Wait for 3 seconds before showing the alert
          }
          return newProgress;
        });
      }, 100);
    }
  };

  const validateFormData = (data) => {
    let errors = {};
    if (!data.email.includes('@')) {
      errors.email = 'Email must be valid';
    }
    // Add more validation rules as needed
    return errors;
  };

  const generateYearOptions = (degree) => {
    if (!degree) return [];

    const options = [];
    for (let i = 1; i <= degree.duration; i++) {
      options.push(
        <option key={i} value={`Year ${i}`}>
          {`Year ${i}`}
        </option>
      );
    }
    return options;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('Times New Roman', 'bold');
    doc.text('Data', 105, 15, { align: 'center' });

    const tableData = [
      ['Field', 'Value'],
      ['Surname', formData.surname],
      ['Name', formData.name],
      ['Mobile', formData.mobile],
      ['Gender', formData.gender],
      ['Email', formData.email],
      ['Permanent Address', formData.permanentAddress],
      ['Current Address', formData.currentAddress],
      ['Pincode', formData.pincode],
      ['State', formData.state],
      ['City', formData.city],
      ['10th School', formData.tenthSchool],
      ['10th Percentage', formData.tenthPercentage],
      ['10th Pass Out Year', formData.tenthPassOutYear],
      ['Intermediate College', formData.interCollege],
      ['Intermediate Percentage', formData.interPercentage],
      ['Intermediate Pass Out Year', formData.interPassOutYear],
      ['University', formData.university],
      ['Graduation', formData.graduation],
      ['Branch', formData.branch],
      ['Year', formData.year]
    ];

    doc.autoTable({
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 20,
      styles: {
        cellWidth: 'wrap',
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 10,
        cellPadding: 2,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: 14
      }
    });

    doc.save('form_data.pdf');
  };

  const handleAddMore = () => {
    if (addMoreClicked === 0) {
      setAddMoreClicked(1);
    } else if (addMoreClicked === 1) {
      setAddMoreClicked(2);
    }
  };

  return (
    <div className="body">
      <div className="multi-step-form">
        <div className="superman-progress">
          <div className="superman-icon" style={{ width: `${supermanProgress}%` }}>
            <img src={supermanFlying} alt="Superman" style={{ width: "50px", height: "auto" }} />
            <div className="percentage">{`${supermanProgress}%`}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="heading">Personal Information</h2>
              <div className="input-group">
                <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="text" name="middlename" placeholder="Middle name" value={formData.middlename} onChange={handleChange} />
              </div>
              <div className="input-group">
                <input type="text" name="name" placeholder="Last Name" value={formData.name} onChange={handleChange} required />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
              <div className="input-group">
                <input type="tel" name="mobile" pattern='[0-9]{10}' placeholder="Mobile" value={formData.mobile} className="input" onChange={handleChange} required />
              </div>
              <div className="input-gender">
                <label htmlFor="gender">Gender:</label>
                <input type='radio' id='male' name='gender' value='Male' onChange={handleChange} required />
                <label htmlFor="male">Male</label>

                <input type='radio' id='female' name='gender' value='Female' onChange={handleChange} required />
                <label htmlFor="female">Female</label>

                <input type='radio' id='other' name='gender' value='Other' onChange={handleChange} required />
                <label htmlFor="other">Other</label>
              </div>
              <div className="input-group">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
              <div className="input-group">
                <input type="file" name="image" className="input" accept="image/*" onChange={handleChange} required />
              </div>
              <div className="button-group">
                <button type="submit">Next</button>
              </div>
            </div>
          )}
          {/* Step 2 */}
          {step === 2 && (
            <div className="form-step">
              <h2>Address</h2>
              <div className="input-group">
                <input type="text" name="permanentAddress" placeholder="Permanent Address" value={formData.permanentAddress} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="text" name="currentAddress" placeholder="Current Address" value={formData.currentAddress} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input className="input"
                  list="states"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <datalist id="states">
                  {indianStates.map((state, index) => (
                    <option key={index} value={state} />
                  ))}
                </datalist>
              </div>
              <div className="input-group">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="button-group">
                <button type="button" onClick={() => setStep(step - 1)}>Back</button>
                <button type="submit">Next</button>
              </div>
            </div>
          )}
          {/* Step 3 */}
          {step === 3 && (
            <div className="form-step">
              <h2>Education Details</h2>

              <div className="input-group">
                <input type="text" name="university" placeholder="University" value={formData.university} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <select
                  name="graduation"
                  value={formData.graduation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Graduation</option>
                  {graduationDegrees.map((degree, index) => (
                    <option key={index} value={degree.name}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDegree && (
                <div className="input-group">
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Branch</option>
                    {selectedDegree.branches.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="input-group">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  {generateYearOptions(selectedDegree)}
                </select>
              </div>
              <div className="input-group">
                <input type="number" name="passedOutYear" className="input" placeholder="Passed Out Year" value={formData.passedOutYear} onChange={handleChange} required />
              </div>

              {/* Add more details */}
              {addMoreClicked === 0 && (
                <button type="button" onClick={handleAddMore}>Add More</button>
              )}
              {addMoreClicked > 0 && (
                <>
                  <div className="input-group">
                    <input type="text" name="tenthSchool" placeholder="10th School" value={formData.tenthSchool} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <input type="number" name="tenthPercentage" placeholder="10th Percentage" value={formData.tenthPercentage} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <input type="number" name="tenthPassOutYear" placeholder="10th Pass Out Year" value={formData.tenthPassOutYear} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <input type="text" name="interCollege" placeholder="Intermediate College" value={formData.interCollege} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <input type="number" name="interPercentage" placeholder="Intermediate Percentage" value={formData.interPercentage} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <input type="number" name="interPassOutYear" placeholder="Intermediate Pass Out Year" value={formData.interPassOutYear} onChange={handleChange} required />
                  </div>
                  {addMoreClicked < 2 && (
                    <button type="button" onClick={handleAddMore}>Add More</button>
                  )}
                </>
              )}

              <div className="button-group">
                <button type="button" onClick={() => setStep(step - 1)}>Back</button>
                <button type="submit">Next</button>
              </div>
            </div>
          )}
          {/* Step 4 */}
          {step === 4 && (
            <div className="form-step">
              <h2>Review and Submit</h2>
              <div className="review-section">
                <h3>Personal Information</h3>
                <img src={imagePreview} alt="Uploaded" style={{ width: '100px', height: 'auto' }} />
                <p><strong>Name:</strong> {formData.surname} {formData.middlename} {formData.name}</p>
                <p><strong>Mobile:</strong> {formData.mobile}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Email:</strong> {formData.email}</p>
              </div>
              <div className="review-section">
                <h3>Address</h3>
                <p><strong>Permanent Address:</strong> {formData.permanentAddress}</p>
                <p><strong>Current Address:</strong> {formData.currentAddress}</p>
                <p><strong>Pincode:</strong> {formData.pincode}</p>
                <p><strong>State:</strong> {formData.state}</p>
                <p><strong>City:</strong> {formData.city}</p>
              </div>
              <div className="review-section">
                <h3>Education Details</h3>
                <p><strong>University</strong> {formData.university}</p>
                <p><strong>Graduation:</strong> {formData.graduation}</p>
                <p><strong>Branch:</strong> {formData.branch}</p>
                <p><strong>Year:</strong> {formData.year}</p>
                <p><strong>Intermediate:</strong> {formData.interCollege}</p>
                <p><strong>Percentage:</strong> {formData.interPercentage}</p>
                <p><strong>Passed Out Year:</strong> {formData.interPassOutYear}</p>
                <p><strong>School:</strong> {formData.tenthSchool}</p>
                <p><strong>Percentage:</strong> {formData.tenthPercentage}</p>
                <p><strong>Passed Out Year</strong> {formData.tenthPassOutYear}</p>


              </div>
              <div className="button-group">
                <button type="button" class="del">Back</button>
                <button type="submit" class="final-submit">Submit</button>
                <div className="pdf-button">
                  <button onClick={handleDownloadPDF}>Download as PDF</button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
