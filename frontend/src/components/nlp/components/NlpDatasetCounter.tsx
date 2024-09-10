/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

import { StyledCardHeader } from "@/app-components/card/StyledCardHeader";
import { useCount } from "@/hooks/crud/useCount";
import { EntityType } from "@/services/types";
import { NlpSampleType } from "@/types/nlp-sample.types";

const NlpDatasetCounter: React.FC = () => {
  const { t } = useTranslation();
  const train = useCount(EntityType.NLP_SAMPLE, { type: NlpSampleType.train });
  const test = useCount(EntityType.NLP_SAMPLE, { type: NlpSampleType.test });
  const entity = useCount(EntityType.NLP_ENTITY, {});

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledCardHeader
        title={`${t("label.total")}: ${
          train.isLoading
            ? `${t("charts.loading")}...`
            : train.data?.count ?? t("charts.error")
        }`}
        description={`${t("label.training_set")}`}
      />
      <StyledCardHeader
        title={`${t("label.total")}: ${
          test.isLoading
            ? `${t("charts.loading")}...`
            : test.data?.count ?? t("charts.error")
        }`}
        description={`${t("label.test_set")}`}
      />
      <StyledCardHeader
        title={`${t("label.total")}: ${
          entity.isLoading
            ? `${t("charts.loading")}...`
            : entity.data?.count ?? t("charts.error")
        }`}
        description={`${t("label.entities")}`}
      />
    </Box>
  );
};

export default NlpDatasetCounter;
