import React, { useState } from 'react';

enum Page {
  giftsList,
}

export default function MainPage() {
  const [page, setPage] = useState(Page.giftsList);

  const goTo = (page: Page) => {
    setPage(page);
  };

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}
