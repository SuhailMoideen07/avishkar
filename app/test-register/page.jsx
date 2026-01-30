"use client";

export default function TestRegisterButton() {
  async function testRegister() {
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: "697c779ecde5cf84ace10564",
        name: "John Pork auto",
        age: 20,
        email: "john@example.com",
        phone: "9999999999",
        participantType: "college",
        college: "ABC College",
        participantDepartment: "CSE",
        semester: "5",
        teamMembers: [],
        paymentScreenshot:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABDQottAAAAABJRU5ErkJggg=="
      }),
    });

    const data = await res.json();
    console.log(data);
  }

  return (
    <button
      onClick={testRegister}
      className="px-4 py-2 bg-red-600 text-white flex items-center justify-center rounded-md align-middle"
    >
      Test Registration
    </button>
  );
}