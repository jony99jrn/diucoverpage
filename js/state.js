// Single source of truth for every field on the page.
// Both the form (draft pane) and the preview (document pane) are
// rendered from this config — add a field here and it appears in both.

const FIELD_GROUPS = [
  {
    id: 'course',
    title: 'Course Information',
    icon: 'book',
    docTitle: 'Course',
    fields: [
      { id: 'courseCode', label: 'Course Code', placeholder: 'CSE 4108', mono: true },
      { id: 'courseTitle', label: 'Course Title', placeholder: 'Software Engineering' },
      { id: 'topicName', label: 'Topic Name', placeholder: 'Requirements Elicitation', full: true },
    ],
  },
  {
    id: 'teacher',
    title: 'Submitted To',
    icon: 'teacher',
    docTitle: 'Submitted to',
    fields: [
      { id: 'teacherName', label: 'Teacher Name', placeholder: 'Dr. Rashed Karim' },
      { id: 'teacherDesignation', label: 'Designation', placeholder: 'Assistant Professor' },
      { id: 'teacherDepartment', label: 'Department', placeholder: 'Computer Science and Engineering', full: true },
    ],
  },
  {
    id: 'student',
    title: 'Submitted By',
    icon: 'student',
    docTitle: 'Submitted by',
    fields: [
      { id: 'studentName', label: 'Student Name', placeholder: 'Your full name' },
      { id: 'studentId', label: 'Student ID', placeholder: '221-15-4321', mono: true },
      { id: 'studentSection', label: 'Section', placeholder: '61_F' },
      { id: 'studentSemester', label: 'Semester', placeholder: 'Spring 2026' },
      { id: 'studentDepartment', label: 'Department', placeholder: 'Computer Science and Engineering', full: true },
    ],
  },
  {
    id: 'date',
    title: 'Submission Date',
    icon: 'calendar',
    docTitle: 'Date of submission',
    fields: [
      { id: 'submissionDate', label: 'Date of Submission', type: 'date', mono: true },
    ],
  },
];

const STORAGE_KEY = 'diu-cover-draft';

const CoverState = {
  data: {},

  allFieldIds() {
    return FIELD_GROUPS.flatMap((g) => g.fields.map((f) => f.id));
  },

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      this.data = saved;
    } catch (e) {
      this.data = {};
    }
  },

  set(fieldId, value) {
    this.data[fieldId] = value;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      /* storage unavailable — continue without persistence */
    }
  },

  get(fieldId) {
    return this.data[fieldId] || '';
  },

  completeness() {
    const ids = this.allFieldIds();
    const filled = ids.filter((id) => this.get(id).trim().length > 0);
    return filled.length / ids.length;
  },
};
