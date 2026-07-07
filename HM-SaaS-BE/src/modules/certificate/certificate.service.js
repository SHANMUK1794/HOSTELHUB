import * as certificateRepo from "./certificate.repository.js";

class CertificateService {
  parseDate(input) {
    if (!input) return null;

    if (input.includes("/")) {
      const [day, month, year] = input.split("/");
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      );
    }

    return new Date(input);
  }

  calculateTimeUntilRenewal(renewalDate) {
    if (!renewalDate || isNaN(new Date(renewalDate))) return null;

    const today = new Date();
    const renewal = new Date(renewalDate);

    renewal.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expired";

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = (diffDays % 365) % 30;

    let result = "";

    if (years > 0) {
      result += `${years} year${years > 1 ? "s" : ""} `;
    }

    if (months > 0) {
      result += `${months} month${months > 1 ? "s" : ""} `;
    }

    if (days > 0 && years === 0) {
      result += `${days} day${days > 1 ? "s" : ""}`;
    }

    return result.trim();
  }

  async addCertificate(data, user, tenantId) {
    const {
      certificate_name,
      certificate_no,
      remainder_date,
      renewal_date,
      branchName: bodyBranch,
    } = data;

    const branchName = user.role?.toLowerCase() === "admin" ? bodyBranch : user.branchName;

    const existing = await certificateRepo.findCertificate({
      branchName,
      certificate_no,
      isdeleted: false,
      tenantId,
    });

    if (existing) {
      throw new Error("Certificate Number already exists.");
    }

    return await certificateRepo.createCertificate({
      certificate_name: certificate_name.trim(),
      certificate_no: certificate_no.trim(),
      branchName: branchName.trim(),
      remainder_date: this.parseDate(remainder_date),
      renewal_date: this.parseDate(renewal_date),
      tenantId,
    });
  }

  async getAll(branchName, tenantId) {
    const certificates = await certificateRepo.findCertificates({
      branchName,
      isdeleted: false,
      tenantId,
    });

    return certificates.map((cert) => ({
      ...cert.toObject(),
      daysUntilRenewal: this.calculateTimeUntilRenewal(cert.renewal_date),
    }));
  }

  async updateCertificate(id, data, tenantId) {
    const existing = await certificateRepo.findCertificateById({ _id: id, tenantId });

    if (!existing) {
      throw new Error("Certificate not found");
    }

    const updateData = {
      ...data,
    };

    if (data.remainder_date) {
      updateData.remainder_date = this.parseDate(data.remainder_date);
    }

    if (data.renewal_date) {
      updateData.renewal_date = this.parseDate(data.renewal_date);
    }

    return await certificateRepo.updateCertificateById({ _id: id, tenantId }, updateData);
  }

  async softDelete(id, userId, tenantId) {
    const record = await certificateRepo.findCertificateById({ _id: id, tenantId });

    if (!record) {
      throw new Error("Certificate not found");
    }

    if (record.isdeleted) {
      throw new Error("Already in trash");
    }

    return await certificateRepo.updateCertificateById({ _id: id, tenantId }, {
      isdeleted: true,
      deletedinfo: {
        deleteddate: new Date(),
        deleteby: userId,
        module: "certificate",
      },
    });
  }

  async recover(id, tenantId) {
    const record = await certificateRepo.findCertificateById({ _id: id, tenantId });

    if (!record || !record.isdeleted) {
      throw new Error("Certificate not found or not deleted");
    }

    const exists = await certificateRepo.findCertificate({
      certificate_no: record.certificate_no,
      branchName: record.branchName,
      isdeleted: false,
      tenantId,
    });

    if (exists) {
      throw new Error("Cannot recover. Duplicate active certificate exists.");
    }

    return await certificateRepo.updateCertificateById({ _id: id, tenantId }, {
      isdeleted: false,
      "deletedinfo.deleteddate": null,
      "deletedinfo.deleteby": null,
    });
  }

  async permanentDelete(id, tenantId) {
    const record = await certificateRepo.findCertificateById({ _id: id, tenantId });

    if (!record) {
      throw new Error("Certificate not found");
    }

    return await certificateRepo.deleteCertificateById({ _id: id, tenantId });
  }

  async permanentDeleteAll(tenantId) {
    const result = await certificateRepo.deleteCertificates({
      isdeleted: true,
      tenantId,
    });

    return result.deletedCount;
  }

  async getDeleted(branchName, tenantId) {
    return await certificateRepo.findCertificates({
      branchName,
      isdeleted: true,
      tenantId,
    });
  }
}

export default new CertificateService();
