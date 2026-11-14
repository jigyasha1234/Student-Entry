import { useState } from "react";
import "./App.css";

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const EMPTY_FORM = { name: "", age: "", grade: "" };

function validate({ name, age, grade }) {
  const errors = {};
  if (!name.trim()) errors.name = "Enter the student’s name.";

  const n = Number(age);
  if (!age.trim()) errors.age = "Enter the student’s age.";
  else if (!Number.isInteger(n) || n < 1 || n > 100)
    errors.age = "Age must be a whole number from 1 to 100.";

  if (!grade) errors.grade = "Select a grade.";
  return errors;
}

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStudents((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        age: Number(form.age),
        grade: form.grade,
      },
    ]);
    setForm(EMPTY_FORM);
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleRemove = (id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <main className="card">
      <h1>Student Entry Form</h1>
      <p className="sub">Add students and review the list below.</p>

      <div className="fields">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. MS Dhoni"
            autoComplete="off"
            value={form.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={errors.name ? "invalid" : ""}
          />
          <span className="err" role="alert">{errors.name}</span>
        </div>

        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            placeholder="e.g. 14"
            value={form.age}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={errors.age ? "invalid" : ""}
          />
          <span className="err" role="alert">{errors.age}</span>
        </div>

        <div className="field">
          <label htmlFor="grade">Grade</label>
          <select
            id="grade"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            className={errors.grade ? "invalid" : ""}
          >
            <option value="">Select grade</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>{`Class ${grade}`}</option>
            ))}
          </select>
          <span className="err" role="alert">{errors.grade}</span>
        </div>
      </div>

      <div className="actions">
        <button type="button" className="primary" onClick={handleAdd}>
          Add Student
        </button>
        <button type="button" className="ghost" onClick={handleClear}>
          Clear
        </button>
      </div>

      <section className="list" aria-live="polite">
        {students.length === 0 ? (
          <div className="empty">No students added yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Grade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.age}</td>
                    <td>{`Class ${s.grade}`}</td>
                    <td>
                      <button
                        type="button"
                        className="remove"
                        aria-label={`Remove ${s.name}`}
                        onClick={() => handleRemove(s.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
