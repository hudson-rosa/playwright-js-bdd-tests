// pages/web/recruitment.page.js

class RecruitmentPage {
  constructor(page) {
    this.page = page;
    this.candidatesTab = { name: "Candidates" };
    this.vacanciesTab = { name: "Vacancies" };
  }

  async openCandidatesTab() {
    await this.page.getByRole("link", this.candidatesTab).click();
  }

  async openVacanciesTab() {
    await this.page.getByRole("link", this.vacanciesTab).click();
  }
}

module.exports = RecruitmentPage;
